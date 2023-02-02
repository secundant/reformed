import { attach, createEvent, createStore, Event, sample, Store } from 'effector';
import { not } from 'patronum';
import type {
  BaseFieldsShape,
  CombinedField,
  CombineFieldsParams,
  FieldsShapeValue
} from '../combine/combine-fields';
import { combineFields } from '../combine/combine-fields';
import { False, True } from '../shared/std';
import type { MaybePromise } from '../shared/types';

export interface CreateFormParams<Shape extends BaseFieldsShape, Value = FieldsShapeValue<Shape>>
  extends CombineFieldsParams<Shape, Value> {
  submit: (value: Value) => MaybePromise<any>;
}

export interface Form<Shape extends BaseFieldsShape, Value> extends CombinedField<Shape, Value> {
  submit: Event<void>;
  $submitting: Store<boolean>;
}

export function createForm<Shape extends BaseFieldsShape, Value>({
  submit: submitHandler,
  ...combineParams
}: CreateFormParams<Shape, Value>): Form<Shape, Value> {
  const submit = createEvent();
  const field = combineFields(combineParams);

  const submitFx = attach({
    source: field.$value,
    effect: submitHandler
  });

  const $submitting = createStore(false).on(field.__.submit, True).on(submitFx.finally, False);
  const validated = sample({
    clock: field.$validating,
    source: field.$valid,
    filter: (_, validating) => !validating
  });
  const validationFailed = sample({
    clock: validated,
    filter: valid => !valid
  });

  sample({
    clock: submit,
    filter: not($submitting),
    target: field.__.submit
  });

  sample({
    clock: validated,
    source: $submitting,
    filter: (submitting, valid) => submitting && valid,
    target: submitFx
  });

  sample({
    clock: validationFailed,
    fn: False,
    target: $submitting
  });

  return {
    ...field,
    submit,
    $submitting
  };
}
