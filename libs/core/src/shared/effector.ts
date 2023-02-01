import { isTruthy } from '@neodx/std';
import type { Store } from 'effector';
import { combine, createStore, is } from 'effector';
import type { ConditionalPick } from 'type-fest';
import { some } from './std';
import type { BaseField } from './types';

export type SourcedValue<T> = T | Store<T>;

export const toStore = <T>(value: SourcedValue<T>): Store<T> =>
  is.store(value) ? value : (createStore(value) as Store<T>);

export const anyField = <K extends keyof ConditionalPick<BaseField, Store<any>>>(
  fields: BaseField[],
  name: K
) => or(fields.map(field => field[name]));

export const or = (stores: Store<any>[]) => combine(stores, some(isTruthy));
