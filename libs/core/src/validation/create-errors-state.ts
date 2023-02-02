import type { Store } from 'effector';
import { not } from 'patronum';
import { isEmptyArray } from '../shared/std';

export interface ErrorsState<T> {
  $errors: Store<T[]>;
  $valid: Store<boolean>;
  $invalid: Store<boolean>;
}

export function createErrorsState<T>($errors: Store<T[]>): ErrorsState<T> {
  const $valid = $errors.map(isEmptyArray);
  const $invalid = not($valid);

  return { $valid, $errors, $invalid };
}
