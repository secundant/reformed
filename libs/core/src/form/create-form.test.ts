import { combineFields, createField } from '@reformed/core';
import { allSettled, fork } from 'effector';
import { describe, expect, test, vi } from 'vitest';
import { createForm } from './create-form';

describe('create-form', () => {
  test('should validate deeply', async () => {
    const submit = vi.fn(() => Promise.resolve('submitted'));
    const submitDeepValidation = vi.fn(async (value: string) => value.length < 10 && 'short');
    const form = createForm({
      fields: {
        a: combineFields({
          fields: {
            b: createField({
              defaultValue: '',
              validate: {
                on: 'submit',
                fn: submitDeepValidation
              }
            })
          }
        })
      },
      submit
    });
    const scope = fork();

    await allSettled(form.change, { scope, params: { a: { b: 'val' } } });
    await allSettled(form.submit, { scope });
    expect(scope.getState(form.$submitting)).toBe(false);
    expect(scope.getState(form.$validating)).toBe(false);
    expect(scope.getState(form.$valid)).toBe(false);
    expect(submit).not.toHaveBeenCalled();
    expect(submitDeepValidation).toHaveBeenCalledOnce();
  });
});
