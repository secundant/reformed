import { allSettled, createStore, fork, is } from 'effector';
import { describe, expect, test } from 'vitest';
import { createField } from '../create-field';

describe('createField', () => {
  test('should create all units', () => {
    const field = createField({ defaultValue: 'value' });
    const scope = fork();

    expect(field.$value).toSatisfy(is.store);
    expect(field.$dirty).toSatisfy(is.store);
    expect(field.$blurred).toSatisfy(is.store);
    expect(field.$focused).toSatisfy(is.store);
    expect(field.$pristine).toSatisfy(is.store);

    expect(field.change).toSatisfy(is.event);
    expect(field.reset).toSatisfy(is.event);

    expect(scope.getState(field.$value)).toBe('value');
  });

  describe('defaultValue', () => {
    test('should work without default value', async () => {
      const field = createField();
      const scope = fork();

      expect(scope.getState(field.$value)).toBeNull();
      expect(scope.getState(field.$dirty)).toBe(false);

      await allSettled(field.change, { scope, params: 123 });

      expect(scope.getState(field.$value)).toBe(123);
      expect(scope.getState(field.$dirty)).toBe(true);

      await allSettled(field.reset, { scope });

      expect(scope.getState(field.$value)).toBeNull();
      expect(scope.getState(field.$dirty)).toBe(false);
    });

    test('should pass default value as plain value', () => {
      const field = createField({ defaultValue: 123 });
      const scope = fork();

      expect(scope.getState(field.$value)).toEqual(123);
    });

    test('should pass default value as store', () => {
      const $defaultValue = createStore(123);
      const field = createField({
        defaultValue: $defaultValue
      });
      const scope = fork();

      expect(scope.getState(field.$value)).toEqual(123);
    });

    test('should take changed defaultValue store after reset', async () => {
      const $defaultValue = createStore('before');
      const field = createField({ defaultValue: $defaultValue });
      const scope = fork();

      expect(scope.getState(field.$value)).toBe('before');
      await allSettled($defaultValue, { scope, params: 'after' });
      expect(scope.getState(field.$value)).toBe('before');
      await allSettled(field.reset, { scope });
      expect(scope.getState(field.$value)).toBe('after');
    });
  });

  describe('interactions', () => {
    test('should react on focus and blur', async () => {
      const field = createField({ defaultValue: 0 });
      const scope = fork();
      const expectInitial = () => {
        expect(scope.getState(field.$touched)).toBe(false);
        expect(scope.getState(field.$focused)).toBe(false);
        expect(scope.getState(field.$visited)).toBe(false);
        expect(scope.getState(field.$blurred)).toBe(true);
      };

      expectInitial();
      await allSettled(field.focus, { scope });

      expect(scope.getState(field.$touched)).toBe(false);
      expect(scope.getState(field.$focused)).toBe(true);
      expect(scope.getState(field.$visited)).toBe(true);
      expect(scope.getState(field.$blurred)).toBe(false);

      await allSettled(field.blur, { scope });

      expect(scope.getState(field.$touched)).toBe(true);
      expect(scope.getState(field.$focused)).toBe(false);
      expect(scope.getState(field.$visited)).toBe(true);
      expect(scope.getState(field.$blurred)).toBe(true);

      await allSettled(field.focus, { scope });

      expect(scope.getState(field.$touched)).toBe(true);
      expect(scope.getState(field.$focused)).toBe(true);
      expect(scope.getState(field.$visited)).toBe(true);
      expect(scope.getState(field.$blurred)).toBe(false);

      await allSettled(field.reset, { scope });
      expectInitial();
    });

    test('should react on value changes', async () => {
      const field = createField({ defaultValue: 0 });
      const scope = fork();
      const expectInitial = () => {
        expect(scope.getState(field.$modified)).toBe(false);
        expect(scope.getState(field.$pristine)).toBe(true);
        expect(scope.getState(field.$dirty)).toBe(false);
        expect(scope.getState(field.$value)).toBe(0);
      };

      expectInitial();
      await allSettled(field.change, { scope, params: 1 });

      expect(scope.getState(field.$modified)).toBe(true);
      expect(scope.getState(field.$pristine)).toBe(false);
      expect(scope.getState(field.$dirty)).toBe(true);
      expect(scope.getState(field.$value)).toBe(1);

      await allSettled(field.change, { scope, params: 0 });

      expect(scope.getState(field.$modified)).toBe(true);
      expect(scope.getState(field.$pristine)).toBe(true);
      expect(scope.getState(field.$dirty)).toBe(false);
      expect(scope.getState(field.$value)).toBe(0);

      await allSettled(field.change, { scope, params: 2 });

      expect(scope.getState(field.$modified)).toBe(true);
      expect(scope.getState(field.$pristine)).toBe(false);
      expect(scope.getState(field.$dirty)).toBe(true);
      expect(scope.getState(field.$value)).toBe(2);

      await allSettled(field.reset, { scope });
      expectInitial();
    });
  });
});
