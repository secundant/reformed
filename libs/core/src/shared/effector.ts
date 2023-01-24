import type { Store } from 'effector';
import { createStore, is } from 'effector';
import { or } from 'patronum';
import type { ConditionalPick } from 'type-fest';
import type { BaseField } from './types';

export type SourcedValue<T> = T | Store<T>;

export const toStore = <T>(value: SourcedValue<T>): Store<T> =>
  is.store(value) ? value : (createStore(value) as Store<T>);

export const anyField = <K extends keyof ConditionalPick<BaseField, Store<any>>>(
  fields: BaseField[],
  name: K
) => or(...fields.map(field => field[name]));
