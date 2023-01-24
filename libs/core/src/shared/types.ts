import type { Event, Store } from 'effector';

export interface BaseField<Value = any, ChangingValue = Value> {
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
   * `true` if this field has ever gained and lost focus
   */
  $touched: Store<boolean>;
  /**
   * `true` if field has ever been focused (until reset)
   */
  $visited: Store<boolean>;

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
  /**
   * Current field value.
   * Restricted to be changed manually, specific method (ex. `.change()`) should be used for this purposes
   */
  $value: Store<Value>;
  /**
   * Change field value
   */
  change: Event<ChangingValue>;
  /**
   * Reset everything
   */
  reset: Event<void>;
  /**
   * @internal Internal API
   */
  __: unknown;
}

export type GetFieldValue<T> = T extends BaseField<infer Value, any> ? Value : never;
export type GetFieldChangeValue<T> = T extends BaseField<any, infer Value> ? Value : never;
