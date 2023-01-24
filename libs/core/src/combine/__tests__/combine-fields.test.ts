import { createField } from '@reformed/core';
import { allSettled, fork, is } from 'effector';
import { describe, expect, test } from 'vitest';
import { assertBaseFieldPublicApi } from '../../shared/test-utils';
import { combineFields } from '../combine-fields';

describe('combineFields', () => {
  test('should create all units', () => {
    const foo = createField({ defaultValue: 1 });
    const bar = createField({ defaultValue: [2] });
    const field = combineFields({ fields: { foo, bar } });
    const scope = fork();

    assertBaseFieldPublicApi(field);

    expect(field.reset).toSatisfy(is.event);
    expect(field.change).toSatisfy(is.event);

    expect(scope.getState(field.$value)).toEqual({ foo: 1, bar: [2] });
  });

  test('should combine value', () => {
    const fields = combineFields({
      fields: {
        name: createField({ defaultValue: '' }),
        age: createField({ defaultValue: 0 })
      }
    });
    const scope = fork();

    expect(scope.getState(fields.$value)).toEqual({ name: '', age: 0 });
  });

  test('should change fields', async () => {
    const combined = combineFields({
      fields: {
        name: createField({ defaultValue: '' }),
        age: createField({ defaultValue: 0 })
      }
    });
    const scope = fork();

    expect(scope.getState(combined.$dirty)).toBeFalsy();

    await allSettled(combined.change, { scope, params: { name: 'John' } });

    expect(scope.getState(combined.$value)).toEqual({ name: 'John', age: 0 });

    expect(scope.getState(combined.fields.name.$dirty)).toBeTruthy();
    expect(scope.getState(combined.fields.age.$dirty)).toBeFalsy();

    await allSettled(combined.change, { scope, params: { name: 'James', age: 10 } });

    expect(scope.getState(combined.$value)).toEqual({ name: 'James', age: 10 });

    expect(scope.getState(combined.fields.name.$dirty)).toBeTruthy();
    expect(scope.getState(combined.fields.age.$dirty)).toBeTruthy();

    expect(scope.getState(combined.fields.name.$value)).toEqual('James');
    expect(scope.getState(combined.fields.age.$value)).toEqual(10);
  });

  test('should reset fields', async () => {
    const foo = createField({ defaultValue: 1 });
    const bar = createField({ defaultValue: 2 });
    const combined = combineFields({ fields: { foo, bar } });

    const scope = fork();

    await allSettled(combined.change, { scope, params: { foo: 10, bar: 20 } });

    expect(scope.getState(combined.fields.foo.$value)).toBe(10);
    expect(scope.getState(combined.fields.bar.$value)).toBe(20);
    expect(scope.getState(combined.$dirty)).toBe(true);

    await allSettled(combined.reset, { scope });

    expect(scope.getState(combined.fields.foo.$value)).toBe(1);
    expect(scope.getState(combined.fields.bar.$value)).toBe(2);
    expect(scope.getState(combined.$dirty)).toBe(false);
  });

  test('should combine interaction states', async () => {
    const foo = createField();
    const bar = createField();
    const field = combineFields({ fields: { foo, bar } });
    const scope = fork();

    const expectInitial = () => {
      expect(scope.getState(field.$dirty)).toBeFalsy();
      expect(scope.getState(field.$touched)).toBeFalsy();
      expect(scope.getState(field.$visited)).toBeFalsy();
      expect(scope.getState(field.$modified)).toBeFalsy();
    };

    expectInitial();

    await allSettled(foo.change, { scope, params: 1 });

    expect(scope.getState(field.$dirty)).toBeTruthy();
    expect(scope.getState(field.$touched)).toBeFalsy();
    expect(scope.getState(field.$visited)).toBeFalsy();
    expect(scope.getState(field.$modified)).toBeTruthy();

    await allSettled(foo.reset, { scope });

    expectInitial(); // $modified ??
  });
});
