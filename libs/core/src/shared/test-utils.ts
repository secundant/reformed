import { is } from 'effector';
import { expect } from 'vitest';
import type { BaseField } from '../field/types';

export function assertBaseFieldPublicApi(field: BaseField) {
  expect(field.$value).toSatisfy(is.store);
  expect(field.$dirty).toSatisfy(is.store);
  expect(field.$blurred).toSatisfy(is.store);
  expect(field.$focused).toSatisfy(is.store);
  expect(field.$visited).toSatisfy(is.store);
  expect(field.$modified).toSatisfy(is.store);
  expect(field.$pristine).toSatisfy(is.store);
}
