// core
import { createEvent, createStore, Event, sample, Store } from 'effector';
import { not } from 'patronum';
import { False, True } from '../shared/shared';

export interface FieldFocusInteractionState {
  /**
   * true if field isn't focused
   * @alias not($focused)
   */
  $blurred: Store<boolean>;
  /**
   * true if field is focused
   */
  $focused: Store<boolean>;
  /**
   * `true` if this field has ever gained and lost focus
   *
   * Useful for knowing when to display error messages.
   */
  $touched: Store<boolean>;
  $visited: Store<boolean>;
}

export interface FieldValueInteractionState {
  $dirty: Store<boolean>;
  $pristine: Store<boolean>;
  $modified: Store<boolean>;
}

export interface FieldInteractionState
  extends FieldFocusInteractionState,
    FieldValueInteractionState {}

export interface FieldInteractionCommands {
  blur: Event<void>;
  focus: Event<void>;
  reset: Event<void>;
}

export interface FieldInteraction extends FieldInteractionState, FieldInteractionCommands {}
export interface CreateFieldInteractionParams {
  $pristine: Store<boolean>;
}

export function createFieldInteraction({
  $pristine
}: CreateFieldInteractionParams): FieldInteraction {
  const blur = createEvent();
  const focus = createEvent();
  const reset = createEvent();

  const $dirty = not($pristine);
  const $focused = createStore(false);
  const $touched = createStore(false);
  const $visited = createStore(false);
  const $modified = createStore(false);

  $visited.on(focus, True);
  $modified.on($dirty, (modified, dirty) => modified || dirty);

  sample({
    clock: blur,
    filter: $focused,
    fn: True,
    target: $touched
  });
  sample({
    clock: blur,
    fn: False,
    target: $focused
  });
  sample({
    clock: focus,
    fn: True,
    target: $focused
  });
  sample({
    clock: reset,
    target: [$touched.reinit!, $focused.reinit!, $visited.reinit!, $modified.reinit!]
  });

  return {
    blur,
    focus,
    reset,
    $dirty,
    $visited,
    $focused,
    $touched,
    $blurred: not($focused),
    $pristine,
    $modified
  };
}
