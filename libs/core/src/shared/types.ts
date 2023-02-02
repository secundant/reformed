import type { Event, Store } from 'effector';
import type { BaseFieldValidationState } from '../validation/create-validation';

export interface BaseFieldCommands<ChangeValue> {
  /**
   * Change field value
   */
  change: Event<ChangeValue>;
  /**
   * Reset everything - value, errors, interaction state, etc.
   */
  reset: Event<void>;
}

export interface BaseFieldInteractionState {
  /**
   * `true` if field isn't focused
   * @alias not($focused)
   */
  $blurred: Store<boolean>;
  /**
   * `true` if field is focused
   */
  $focused: Store<boolean>;
  /**
   * `true` if this field has ever gained and lost focus (`true` until reset)
   */
  $touched: Store<boolean>;
  /**
   * `true` if field has ever had focus (`true` until reset)
   * @alias or($focused, $touched)
   */
  $visited: Store<boolean>;
}

export interface BaseFieldModificationState {
  /**
   * `true` if value is not equal to the default value
   */
  $dirty: Store<boolean>;
  /**
   * `true` if value is equal to the default value
   * @alias not($dirty)
   */
  $pristine: Store<boolean>;
  /**
   * `true` if value has ever been changed (until field is reset)
   */
  $modified: Store<boolean>;
}

export interface BaseField<Value = any, ChangingValue = Value>
  extends BaseFieldCommands<ChangingValue>,
    BaseFieldValidationState,
    BaseFieldInteractionState,
    BaseFieldModificationState {
  /**
   * Current field value.
   * Restricted to be changed manually, specific method (ex. `.change()`) should be used for that purposes.
   */
  $value: Store<Value>;
  /**
   * @internal Internal API
   */
  __: unknown;
}

export type GetFieldValue<T> = T extends BaseField<infer Value, any> ? Value : never;
export type GetFieldChangeValue<T> = T extends BaseField<any, infer Value> ? Value : never;

export type MaybePromise<T> = T | Promise<T>;
