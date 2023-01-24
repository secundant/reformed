import { entries } from '@neodx/std';
import type { Event, Store } from 'effector';
import { combine, createEvent, sample } from 'effector';
import { not } from 'patronum';
import { FieldKind } from '../field/create-field';
import { anyField } from '../shared/effector';
import { createKind } from '../shared/internals';
import type { BaseField, GetFieldChangeValue, GetFieldValue } from '../shared/types';

export interface CombineFieldsParams<Shape extends BaseFieldsShape> {
  fields: Shape;
  mapValue?: (shapeValue: FieldsShapeValue<Shape>) => FieldsShapeValue<Shape>;
}

export interface CombinedField<Shape extends BaseFieldsShape>
  extends BaseField<FieldsShapeValue<Shape>, Partial<FieldsShapeChangingValue<Shape>>> {
  fields: Shape;
  reset: Event<void>;
  __: {
    kind: unknown;
  };
}

export type BaseFieldsShape = Record<string, BaseField>;
export type FieldsShapeValue<T> = {
  [Key in keyof T]: GetFieldValue<T[Key]>;
};
export type FieldsShapeChangingValue<T> = {
  [Key in keyof T]: GetFieldChangeValue<T[Key]>;
};

export function combineFields<Shape extends BaseFieldsShape>({
  fields
}: CombineFieldsParams<Shape>): CombinedField<Shape> {
  const fieldsList = Object.values(fields);
  const reset = createEvent();
  const change = createEvent<Partial<FieldsShapeChangingValue<Shape>>>();

  const $dirty = anyField(fieldsList, '$dirty');
  const $focused = anyField(fieldsList, '$focused');
  const $touched = anyField(fieldsList, '$touched');
  const $visited = anyField(fieldsList, '$visited');
  const $modified = anyField(fieldsList, '$modified');

  for (const [name, field] of entries(fields)) {
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
    }
  }

  return {
    __: {
      kind: CombinedFieldKind.value
    },

    $dirty,
    $touched,
    $visited,
    $focused,
    $blurred: not($focused),
    $pristine: not($dirty),
    $modified,
    $value: combineFieldsValues(fields),

    fields,
    change,
    reset
  };
}

export const CombinedFieldKind = createKind<CombinedField<any>>('CombinedField');

export function combineFieldsValues<Shape extends BaseFieldsShape>(
  shape: Shape
): Store<FieldsShapeValue<Shape>> {
  return combine(
    Object.fromEntries(entries(shape).map(([name, field]) => [name, field.$value]))
  ) as unknown as Store<FieldsShapeValue<Shape>>;
}
