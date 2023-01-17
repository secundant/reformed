import { createField } from '@reformed/core';
import type { Store } from 'effector';
import { describe, expectTypeOf, test } from 'vitest';

describe('createField', () => {
  test('should infer value', () => {
    expectTypeOf(createField().$value).toEqualTypeOf<Store<unknown>>();
    expectTypeOf(createField<number>().$value).toEqualTypeOf<Store<number>>();
    expectTypeOf(createField({ defaultValue: 1 }).$value).toEqualTypeOf<Store<number>>();
  });
});
