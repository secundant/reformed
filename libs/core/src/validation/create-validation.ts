import { toArray } from '@neodx/std';
import { combine, createEffect, createEvent, Event, sample, Store, Unit } from 'effector';
import { createErrorsState, ErrorsState } from './create-errors-state';
import { createRule, RuleFn, ValidationRuleResult } from './create-rule';

export type ValidationTrigger = 'submit' | 'blur' | 'change';
export type ValidationUserConfig<Value> =
  | RuleFn<Value>
  | ValidationConfig<Value>
  | ValidationConfig<Value>[];

export interface ValidationConfig<Value> {
  on?: ValidationTrigger | ValidationTrigger[];
  fn: RuleFn<Value>;
}

export interface ValidateFxParams<Value> {
  value: Value;
  on: ValidationTrigger[];
}

export interface CreateValidationParams<Value> {
  config?: ValidationUserConfig<Value>;
  $value: Store<Value>;
}

export interface ValidationError extends ValidationRuleResult {
  __?: unknown; // todo define ValidationError responsibility
}

export interface BaseFieldValidationState extends ErrorsState<ValidationError> {
  revalidate: Event<ValidationTrigger[]>;
  $validating: Store<boolean>;
}

export function createValidation<Value>({ config = [], $value }: CreateValidationParams<Value>) {
  const configs = toArray(typeof config === 'function' ? { fn: config } : config);
  const rules = configs.map(({ fn, on = defaultValidationTrigger }) => ({
    on: toArray(on),
    ...createRule(fn)
  }));

  const reset = createEvent();
  const submitted = createEvent();
  const revalidate = createEvent<ValidationTrigger[]>();

  const validateFx = createEffect(async ({ value, on }: ValidateFxParams<Value>) =>
    Promise.all(
      rules
        .filter(validation => on.some(trigger => validation.on.includes(trigger)))
        .map(validation => validation.validateFx(value))
    )
  );

  const errorsState = createErrorsState(
    combine(
      rules.map(({ $errors }) => $errors),
      errors => errors.filter(Boolean).flat() as ValidationError[]
    )
  );

  const bind = (clock: Unit<unknown>, on: ValidationTrigger) =>
    sample({
      clock,
      target: revalidate.prepend(() => [on])
    });

  sample({
    clock: reset,
    target: rules.map(rule => rule.reset)
  });
  sample({
    clock: revalidate,
    source: $value,
    fn: (value, on) => ({ on, value }),
    target: validateFx
  });

  bind(submitted, 'submit');
  return {
    ...errorsState,
    revalidate,
    $validating: validateFx.pending,
    __: {
      bind,
      reset,
      submitted,
      validateFx
    }
  };
}

const defaultValidationTrigger = ['blur', 'submit'] as const;
