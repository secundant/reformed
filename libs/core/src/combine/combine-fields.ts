import { entries, identity } from '@neodx/std';
import type { Event, Store } from 'effector';
import { combine, createEvent, sample } from 'effector';
import { not } from 'patronum';
import { FieldKind } from '../field/create-field';
import { anyField, or } from '../shared/effector';
import { createKind } from '../shared/internals';
import { concat } from '../shared/std';
import type { BaseField, GetFieldChangeValue, GetFieldValue } from '../shared/types';
import { createErrorsState } from '../validation/create-errors-state';
import {
  createValidation,
  ValidationError,
  ValidationTrigger,
  ValidationUserConfig
} from '../validation/create-validation';

export interface CombineFieldsParams<
  Shape extends BaseFieldsShape,
  Value = FieldsShapeValue<Shape>
> {
  fields: Shape;
  mapValue?: (shapeValue: FieldsShapeValue<Shape>) => Value;
  validate?: ValidationUserConfig<Value>;
}

export interface CombinedField<Shape extends BaseFieldsShape, Value = FieldsShapeValue<Shape>>
  extends BaseField<Value, Partial<FieldsShapeChangingValue<Shape>>> {
  mapFields: MapCombinedFields<Shape>;
  fields: Shape;
  reset: Event<void>;
  __: {
    kind: unknown;
    submit: Event<void>;
  };
}

export interface MapCombinedFields<Shape extends BaseFieldsShape> {
  <MappedValue>(
    mapValue: <Key extends keyof Shape>(field: Shape[Key], key: Key) => Store<MappedValue>
  ): Store<Record<keyof Shape, MappedValue>>;

  <MappedValue, MappedShape>(
    mapValue: <Key extends keyof Shape>(field: Shape[Key], key: Key) => Store<MappedValue>,
    mapShape: (shape: Record<keyof Shape, MappedValue>) => MappedShape
  ): Store<MappedShape>;
}

export type BaseFieldsShape = Record<string, BaseField>;
export type FieldsShapeValue<T> = {
  [Key in keyof T]: GetFieldValue<T[Key]>;
};
export type FieldsShapeChangingValue<T> = {
  [Key in keyof T]: GetFieldChangeValue<T[Key]>;
};

export function combineFields<Shape extends BaseFieldsShape, Value = FieldsShapeValue<Shape>>({
  fields,
  mapValue = identity as any,
  validate
}: CombineFieldsParams<Shape, Value>): CombinedField<Shape, Value> {
  const fieldsEntries = entries(fields);
  const fieldsList = Object.values(fields);

  const reset = createEvent();
  const submit = createEvent();
  const change = createEvent<Partial<FieldsShapeChangingValue<Shape>>>();
  const revalidate = createEvent<ValidationTrigger[]>();

  const $dirty = anyField(fieldsList, '$dirty');
  const $focused = anyField(fieldsList, '$focused');
  const $touched = anyField(fieldsList, '$touched');
  const $visited = anyField(fieldsList, '$visited');
  const $modified = anyField(fieldsList, '$modified');
  const $fieldsValidating = anyField(fieldsList, '$validating');

  // overloads covers it
  const mapFields = ((mapValue: any, mapShape?: any) =>
    combine(
      Object.fromEntries(fieldsEntries.map(([name, field]) => [name, mapValue(field, name)])),
      mapShape
    )) as MapCombinedFields<Shape>;

  const $value = mapFields(field => field.$value, mapValue);
  const validation = createValidation({
    config: validate,
    $value
  });

  const $combinedErrors = mapFields(
    (field, name) =>
      field.$errors.map(errors =>
        errors.flatMap<ValidationError>(error => ({
          ...error,
          path: error.path ? `${name.toString()}.${error.path}` : name.toString()
        }))
      ),
    errorsShape => Object.values(errorsShape).flat()
  );
  const errorsState = createErrorsState(combine($combinedErrors, validation.$errors, concat));

  for (const [name, field] of fieldsEntries) {
    if (CombinedFieldKind.is(field) || FieldKind.is(field)) {
      sample({
        clock: change.map(changes => (changes as any)[name]),
        filter: Boolean,
        target: field.change
      });

      sample({
        clock: reset,
        target: field.reset
      });

      sample({
        clock: submit,
        target: field.__.submit
      });

      sample({
        clock: revalidate,
        target: field.revalidate
      });
    }
  }

  validation.__.bind($value, 'change');
  sample({
    clock: submit,
    target: validation.__.submitted
  });
  sample({
    clock: revalidate,
    target: validation.revalidate
  });

  return {
    ...validation,
    __: {
      kind: CombinedFieldKind.get(),
      submit
    },

    $dirty,
    $touched,
    $visited,
    $focused,
    $blurred: not($focused),
    $pristine: not($dirty),
    $modified,

    $value,
    $validating: or([validation.$validating, $fieldsValidating]),
    revalidate,
    ...errorsState,

    mapFields,
    fields,
    change,
    reset
  };
}

export const CombinedFieldKind = createKind<CombinedField<any>>('CombinedField');
