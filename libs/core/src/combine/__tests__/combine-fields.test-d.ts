import { createField } from '@reformed/core';
import type { Store } from 'effector';
import type { EmptyObject } from 'type-fest';
import { describe, expectTypeOf, test } from 'vitest';
import type { Field } from '../../field/create-field';
import { CombinedField, combineFields } from '../combine-fields';

describe('combineFields - types', () => {
  test('should infer Field', () => {
    expectTypeOf(
      combineFields({
        fields: {
          a: createField({ defaultValue: 123 }),
          b: createField({ defaultValue: 'str' as const }),
          c: createField({ defaultValue: [1, '', true] })
        }
      }).$value
    ).toEqualTypeOf<Store<{ a: number; b: 'str'; c: Array<number | string | boolean> }>>();
  });

  test('should infer CombinedField', () => {
    expectTypeOf(
      combineFields({
        fields: {
          a: combineFields({
            fields: {
              c: createField()
            }
          }),
          b: combineFields({
            fields: {}
          })
        }
      }).$value
    ).toEqualTypeOf<Store<{ a: { c: unknown }; b: EmptyObject }>>();
  });

  test('should infer any fields values', () => {
    expectTypeOf(
      combineFields({
        fields: {
          a: createField({ defaultValue: 123 as const }),
          b: createField({ defaultValue: 'str' }),
          c: combineFields({
            fields: {
              d: createField({
                defaultValue: false
              }),
              e: combineFields({
                fields: {
                  f: combineFields({
                    fields: {
                      g: createField({ defaultValue: [1, 2, '3'] })
                    }
                  })
                }
              })
            }
          })
        }
      }).$value
    ).toEqualTypeOf<
      Store<{ a: 123; b: string; c: { d: boolean; e: { f: { g: Array<string | number> } } } }>
    >();
  });

  test('should preserve types', () => {
    const combined = combineFields({
      fields: {
        a: createField({ defaultValue: 'foo' as const }),
        b: combineFields({
          fields: {
            c: combineFields({
              fields: {
                d: createField({ defaultValue: 'bar' as const })
              }
            })
          }
        })
      }
    });

    expectTypeOf(combined.fields.a).toEqualTypeOf<Field<'foo'>>();
    expectTypeOf(combined.fields.b.fields.c).toEqualTypeOf<
      CombinedField<{
        d: Field<'bar'>;
      }>
    >();
  });

  test('should provide deeply partial change event', () => {
    const combined = combineFields({
      fields: {
        a: createField({ defaultValue: 'foo' as const }),
        b: combineFields({
          fields: {
            c: combineFields({
              fields: {
                d: createField({ defaultValue: 'bar' as const })
              }
            })
          }
        })
      }
    });

    expectTypeOf(combined.change({ b: { c: { d: 'bar' } } })).toEqualTypeOf<{
      a?: 'foo';
      b?: {
        c?: {
          d?: 'bar';
        };
      };
    }>();
  });
});
