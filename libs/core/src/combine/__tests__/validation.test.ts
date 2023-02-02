import { combineFields, createField } from '@reformed/core';
import { allSettled, fork } from 'effector';
import { describe, expect, test } from 'vitest';

describe('CombineField Validation', () => {
  test('should combine Field errors', async () => {
    const field = combineFields({
      fields: {
        a: createField({
          defaultValue: 0,
          validate: {
            on: 'change',
            fn: value => value < 10 && 'min'
          }
        }),
        b: createField({
          defaultValue: '',
          validate: value => value.length < 2 && 'minLength'
        })
      }
    });
    const scope = fork();

    await allSettled(field.change, { scope, params: { a: 1 } });
    expect(scope.getState(field.fields.a.$errors)).toEqual([{ message: 'min' }]);
    expect(scope.getState(field.$errors)).toEqual([{ message: 'min', path: 'a' }]);
    await allSettled(field.fields.b.focus, { scope });
    await allSettled(field.fields.b.blur, { scope });
    expect(scope.getState(field.fields.b.$errors)).toEqual([{ message: 'minLength' }]);
    expect(scope.getState(field.$errors)).toEqual([
      { message: 'min', path: 'a' },
      { message: 'minLength', path: 'b' }
    ]);
  });

  test('should combine CombineField errors', async () => {
    const field = combineFields({
      fields: {
        a: combineFields({
          fields: {
            b: createField({
              defaultValue: 0,
              validate: {
                on: 'change',
                fn: value => value < 10 && 'min'
              }
            })
          }
        })
      }
    });
    const scope = fork();

    await allSettled(field.change, { scope, params: { a: { b: 1 } } });
    expect(scope.getState(field.fields.a.$errors)).toEqual([{ message: 'min', path: 'b' }]);
    expect(scope.getState(field.$errors)).toEqual([{ message: 'min', path: 'a.b' }]);
  });

  test('should merge with self validations', async () => {
    const field = combineFields({
      fields: {
        a: createField({
          defaultValue: 0,
          validate: {
            on: 'change',
            fn: value => value < 10 && 'min'
          }
        })
      },
      validate: {
        on: 'change',
        fn: ({ a }) => a < 5 && 'super_min'
      }
    });
    const scope = fork();

    await allSettled(field.change, { scope, params: { a: 4 } });
    expect(scope.getState(field.$errors)).toEqual([
      { message: 'min', path: 'a' },
      { message: 'super_min' }
    ]);
    await allSettled(field.change, { scope, params: { a: 5 } });
    expect(scope.getState(field.$errors)).toEqual([{ message: 'min', path: 'a' }]);
  });

  test('should support multiple validations', async () => {});
});
