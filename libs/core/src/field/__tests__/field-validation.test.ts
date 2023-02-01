import { createField } from '@reformed/core';
import { allSettled, attach, createStore, fork } from 'effector';
import { describe, expect, test } from 'vitest';
import { expectArrayEqual } from '../../shared/test-utils';

describe('createField > validation', () => {
  test('should validate on blur with plain function', async () => {
    const field = createField({
      defaultValue: 0,
      validate: value => value < 10
    });
    const scope = fork();

    await allSettled(field.focus, { scope });
    await allSettled(field.change, { scope, params: 2 });

    expect(scope.getState(field.$errors)).toEqual([]);
    expect(scope.getState(field.$valid)).toBe(true);

    // validate after "blurred"
    await allSettled(field.blur, { scope });

    expect(scope.getState(field.$valid)).toBe(false);

    await allSettled(field.change, { scope, params: 11 });
    // value changes don't trigger validation
    expect(scope.getState(field.$valid)).toBe(false);

    await allSettled(field.blur, { scope });
    // "blur" don't trigger "blurred" because fields already was $blurred
    expect(scope.getState(field.$valid)).toBe(false);

    await allSettled(field.focus, { scope });
    await allSettled(field.blur, { scope });
    // and only after end of "focus+blur" "blurred" will be triggered and field will be revalidated
    expect(scope.getState(field.$valid)).toBe(true);
  });

  test('should validate every change', async () => {
    const field = createField({
      defaultValue: 0,
      validate: {
        on: 'change',
        fn: value => value < 10
      }
    });
    const scope = fork();

    await allSettled(field.focus, { scope });
    await allSettled(field.blur, { scope });
    // no validations
    expect(scope.getState(field.$valid)).toBeTruthy();

    await allSettled(field.change, { scope, params: 1 });
    expect(scope.getState(field.$valid)).toBeFalsy();
    await allSettled(field.change, { scope, params: 11 });
    expect(scope.getState(field.$valid)).toBeTruthy();
  });

  test('should validate on multiple triggers', async () => {
    const field = createField({
      defaultValue: 0,
      validate: [
        {
          on: 'blur',
          fn: value => value % 2 === 0 && 'odd'
        },
        {
          on: 'change',
          fn: value => value < 10 && 'min'
        },
        {
          on: ['blur', 'change'],
          fn: value => value > 100 && 'max'
        }
      ]
    });
    const scope = fork();
    const messagesEq = (messages: string[]) =>
      expectArrayEqual(
        scope.getState(field.$errors).map(error => error.message),
        messages
      );

    await allSettled(field.focus, { scope });
    await allSettled(field.blur, { scope });
    messagesEq(['odd']);
    await allSettled(field.reset, { scope });
    messagesEq([]);
    await allSettled(field.change, { scope, params: 2 });
    messagesEq(['min']);
    await allSettled(field.reset, { scope });
    messagesEq([]);
    await allSettled(field.focus, { scope });
    await allSettled(field.change, { scope, params: 2 });
    messagesEq(['min']);
    await allSettled(field.blur, { scope });
    messagesEq(['min', 'odd']);
    await allSettled(field.focus, { scope });
    await allSettled(field.change, { scope, params: 102 });
    messagesEq(['max', 'odd']);
    await allSettled(field.change, { scope, params: 51 });
    messagesEq(['odd']);
    await allSettled(field.blur, { scope });
    messagesEq([]);
  });

  test('should work with attached', async () => {
    const $max = createStore(10);
    const field = createField({
      defaultValue: 0,
      validate: {
        on: 'change',
        fn: attach({
          effect: (max, value) => value > max && 'max',
          source: $max
        })
      }
    });
    const scope = fork();

    await allSettled(field.change, { scope, params: 20 });
    expect(scope.getState(field.$errors)).toEqual([{ message: 'max' }]);
    await allSettled(field.change, { scope, params: 10 });
    expect(scope.getState(field.$errors)).toEqual([]);
  });
});
