import { combine, createEvent, createStore, sample } from 'effector';
import { SourcedValue, toStore } from '../shared/sourced';
import { createFieldInteraction, FieldInteractionState } from './create-field-interaction';

export interface CreateFieldParams<Value> {
  defaultValue?: SourcedValue<Value>;
}

export interface Field<Value> extends FieldInteractionState {
  $value: Value;
}

export function createField<Value>({ defaultValue }: CreateFieldParams<Value> = {}) {
  const reset = createEvent();
  const change = createEvent<Value>();

  const $defaultValue = toStore(defaultValue ?? (null as Value));
  // eslint-disable-next-line effector/no-getState
  const $currentValue = createStore<Value>($defaultValue.getState());
  const interaction = createFieldInteraction({
    $pristine: combine($defaultValue, $currentValue, Object.is)
  });

  sample({
    clock: change,
    target: $currentValue
  });
  sample({
    clock: reset,
    target: [interaction.reset]
  });
  sample({
    clock: reset,
    source: $defaultValue,
    target: $currentValue
  });

  return {
    $value: $currentValue,
    ...interaction,
    reset,
    change
  };
}
