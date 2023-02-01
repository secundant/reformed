import { is } from 'effector';
import { expect } from 'vitest';
import type { BaseField } from './types';

export function assertBaseFieldPublicApi(field: BaseField) {
  expect(field.$value).toSatisfy(is.store);
  expect(field.$dirty).toSatisfy(is.store);
  expect(field.$blurred).toSatisfy(is.store);
  expect(field.$focused).toSatisfy(is.store);
  expect(field.$visited).toSatisfy(is.store);
  expect(field.$modified).toSatisfy(is.store);
  expect(field.$pristine).toSatisfy(is.store);
}

export function expectArrayEqual<T>(left: T[], right: T[]) {
  // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
  expect([...left].sort()).toEqual([...right].sort());
}
