import type { Effect } from 'effector';

export type ValidationTriggerType = 'change' | 'submit' | 'blur';

export type ValidationPassedResult = false | null;
export type ValidationFailedResult = string;
export type ValidationResult = ValidationPassedResult | ValidationFailedResult;

export type ValidationEffect<Value> = Effect<Value, ValidationResult>;

export function createFieldValidation() {}

/**
 * - field validation
 * - group validation
 */
