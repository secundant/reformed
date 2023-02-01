import { createEffect, createEvent, restore } from 'effector';
import type { MaybePromise } from '../shared/types';

export type RulePositiveResult = false | '' | null | undefined;
export type RuleNegativeResult = true | Exclude<string, ''>;

export type RuleResult = RulePositiveResult | RuleNegativeResult | ValidationRuleResult[];

export type RuleFn<Value> = (value: Value) => MaybePromise<RuleResult>;

export interface ValidationRuleResult {
  name?: string;
  path?: string;
  message: string;
  context?: any;
}

export function createRule<Value>(fn: RuleFn<Value>) {
  const reset = createEvent();
  const validateFx = createEffect(fn);

  const $result = restore(validateFx.doneData, null).reset(reset);
  const $errors = $result.map(toRuleResult);

  return { reset, $errors, validateFx };
}

const toRuleResult = (result: RuleResult): ValidationRuleResult[] =>
  result ? (Array.isArray(result) ? result : [{ message: String(result) }]) : [];
