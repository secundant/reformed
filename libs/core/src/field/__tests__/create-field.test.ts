import { allSettled, createEvent, createStore, fork, is, sample } from 'effector';
import { describe, expect, test } from 'vitest';
import { assertBaseFieldPublicApi } from '../../shared/test-utils';
import { createField } from '../create-field';

describe('createField', () => {
  test('should create all units', () => {
    const field = createField({ defaultValue: 'value' });
    const scope = fork();

    assertBaseFieldPublicApi(field);

    expect(field.$value).toSatisfy(is.store);

    expect(field.blur).toSatisfy(is.event);
    expect(field.focus).toSatisfy(is.event);
    expect(field.reset).toSatisfy(is.event);
    expect(field.change).toSatisfy(is.event);

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

  describe('disabled', () => {
    test('should prevent updates if field is disabled by default', async () => {
      const field = createField({ disabled: true });
      const scope = fork();

      expect(scope.getState(field.$disabled)).toBeTruthy();
      expect(scope.getState(field.$value)).toBeNull();
      await allSettled(field.change, { scope, params: 123 });
      expect(scope.getState(field.$value)).toBeNull();
      await allSettled(field.$disabled, { scope, params: false });
      await allSettled(field.change, { scope, params: 123 });
      expect(scope.getState(field.$value)).toBe(123);
    });

    test('should support external store', async () => {
      const $disabled = createStore(false);
      const field = createField({ disabled: $disabled, defaultValue: 0 });
      const scope = fork();

      await allSettled(field.change, { scope, params: 1 });

      expect(scope.getState(field.$value)).toBe(1);
      expect(scope.getState(field.$disabled)).toBeFalsy();

      await allSettled($disabled, { scope, params: true });
      await allSettled(field.change, { scope, params: 2 });

      expect(scope.getState(field.$value)).toBe(1);
      expect(scope.getState(field.$disabled)).toBeTruthy();
    });

    test('should react on flow "click -> [toggle disabled, increment]"', async () => {
      const buttonClicked = createEvent();
      const increment = createEvent();
      const field = createField({ disabled: false, defaultValue: 0 });

      sample({
        clock: buttonClicked,
        source: field.$disabled,
        fn: disabled => !disabled,
        target: [field.$disabled, increment]
      });
      sample({
        clock: increment,
        source: field.$value,
        fn: value => value + 1,
        target: field.change
      });

      const scope = fork();

      await allSettled(field.change, { scope, params: 1 });
      await allSettled(buttonClicked, { scope });

      expect(scope.getState(field.$value)).toBe(1);
      expect(scope.getState(field.$disabled)).toBeTruthy();

      await allSettled(buttonClicked, { scope });

      expect(scope.getState(field.$value)).toBe(2);
      expect(scope.getState(field.$disabled)).toBeFalsy();

      await allSettled(buttonClicked, { scope });
      await allSettled(buttonClicked, { scope });
      await allSettled(buttonClicked, { scope });

      expect(scope.getState(field.$value)).toBe(3);
      expect(scope.getState(field.$disabled)).toBeTruthy();
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
