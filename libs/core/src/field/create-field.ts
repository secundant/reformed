import { combine, createEvent, createStore, Event, sample, Store } from 'effector';
import { not } from 'patronum';
import { SourcedValue, toStore } from '../shared/effector';
import { createKind } from '../shared/internals';
import { False, True } from '../shared/std';
import type { BaseField } from './types';

export interface CreateFieldParams<Value> {
  defaultValue?: SourcedValue<Value>;
  disabled?: SourcedValue<boolean>;
}

export interface Field<Value> extends BaseField<Value> {
  /**
   * Disabled fields don't react on `change` event.
   * @todo should it reset $focused and prevent focus?
   */
  $disabled: Store<boolean>;

  blur: Event<void>;
  focus: Event<void>;
  reset: Event<void>;
  change: Event<Value>;
  /**
   * @internal Internal API
   */
  __: {
    kind: unknown;
  };
}

export function createField<Value>({
  defaultValue = null as Value,
  disabled = false
}: CreateFieldParams<Value> = {}): Field<Value> {
  const blur = createEvent();
  const focus = createEvent();
  const reset = createEvent();
  const change = createEvent<Value>();

  const $disabled = toStore(disabled);
  const $defaultValue = toStore(defaultValue);
  // todo any solution to replace .getState() ?
  // eslint-disable-next-line effector/no-getState
  const $currentValue = createStore<Value>($defaultValue.getState());

  const $focused = createStore(false);
  const $touched = createStore(false);
  const $visited = createStore(false);
  const $modified = createStore(false);

  const $pristine = combine($defaultValue, $currentValue, Object.is);
  const $blurred = not($focused);
  const $dirty = not($pristine);

  $visited.on(focus, True);
  $focused.on(focus, True).on(blur, False);
  $modified.on($dirty, (modified, dirty) => modified || dirty);

  sample({
    clock: blur,
    filter: $visited,
    fn: True,
    target: $touched
  });

  sample({
    clock: change,
    filter: not($disabled),
    target: $currentValue
  });

  sample({
    clock: reset,
    target: [$touched.reinit!, $focused.reinit!, $visited.reinit!, $modified.reinit!]
  });
  sample({
    clock: reset,
    source: $defaultValue,
    target: $currentValue
  });

  return {
    __: {
      kind: FieldKind.value
    },

    blur,
    focus,
    reset,
    change,

    $dirty,
    $visited,
    $focused,
    $touched,
    $blurred,
    $pristine,
    $modified,

    $disabled,
    $value: $currentValue
  };
}

export const FieldKind = createKind<Field<any>>('Field');
