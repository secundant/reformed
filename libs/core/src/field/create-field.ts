import { combine, createEvent, createStore, Event, sample, Store } from 'effector';
import { and, not } from 'patronum';
import { SourcedValue, toStore } from '../shared/effector';
import { createKind } from '../shared/internals';
import { False, True } from '../shared/std';
import type { BaseField } from '../shared/types';
import { createValidation, ValidationUserConfig } from '../validation/create-validation';

export interface Field<Value> extends BaseField<Value, Value> {
  /**
   * Disabled fields don't react on `change` event.
   * @todo should it reset $focused and prevent focus?
   */
  $disabled: Store<boolean>;

  // Interaction API

  blur: Event<void>;
  /**
   * Command to
   */
  focus: Event<void>;

  /**
   * Fires when field lost focus
   */
  blurred: Event<void>;
  /**
   * Fires when field gained focus
   */
  focused: Event<void>;
  /**
   * Fires after every actual value change
   */
  changed: Event<Value>;
  __: {
    kind: symbol;
    submit: Event<void>;
  };
}

export interface CreateFieldParams<Value> {
  valueEq?: (left: Value, right: Value) => boolean;
  defaultValue?: SourcedValue<Value>;
  disabled?: SourcedValue<boolean>;
  validate?: ValidationUserConfig<Value>;
}

export function createField<Value>({
  valueEq = Object.is,
  defaultValue = null as Value,
  disabled = false,
  validate
}: CreateFieldParams<Value> = {}): Field<Value> {
  // Commands

  const blur = createEvent();
  const focus = createEvent();
  const reset = createEvent();
  const change = createEvent<Value>();

  // Events

  const blurred = createEvent();
  const focused = createEvent();
  const changed = createEvent<Value>();

  // Core stores

  const $defaultValue = toStore(defaultValue);
  const $disabled = toStore(disabled);
  // todo any solution to replace .getState() ?
  // eslint-disable-next-line effector/no-getState
  const $value = createStore<Value>($defaultValue.getState());
  const validation = createValidation({
    $value,
    config: validate
  });

  // Interaction and modification stores

  const $focused = createStore(false);
  const $touched = createStore(false);
  const $visited = createStore(false);
  const $modified = createStore(false);

  const $pristine = combine($defaultValue, $value, valueEq);
  const $blurred = not($focused);
  const $enabled = not($disabled);
  const $dirty = not($pristine);

  $visited.on(focused, True);
  $touched.on(blurred, True);
  $focused.on(focused, True).on(blurred, False);
  $modified.on($dirty, (modified, dirty) => modified || dirty);

  validation.__.bind(blurred, 'blur');
  validation.__.bind(changed, 'change');

  sample({
    clock: focus,
    filter: and($enabled, not($focused)),
    target: focused
  });

  sample({
    clock: blur,
    filter: $focused,
    target: blurred
  });

  sample({
    clock: change,
    source: [$enabled, $value] as const,
    filter: ([enabled, current], value) => enabled && !valueEq(current, value),
    fn: (_, value) => value,
    target: [$value, changed]
  });

  sample({
    clock: reset,
    target: [
      $touched.reinit!,
      $focused.reinit!,
      $visited.reinit!,
      $modified.reinit!,
      validation.__.reset
    ]
  });
  sample({
    clock: reset,
    source: $defaultValue,
    target: $value
  });

  return {
    ...validation,
    __: {
      kind: FieldKind.get(),
      submit: validation.__.submitted
    },

    blur,
    focus,
    reset,
    change,

    changed,
    blurred,
    focused,

    $dirty,
    $visited,
    $focused,
    $touched,
    $blurred,
    $pristine,
    $modified,

    $disabled,
    $value
  };
}

export const FieldKind = createKind<Field<any>>('Field');
