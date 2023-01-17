import type { Store } from 'effector';
import { createStore, is } from 'effector';

export type SourcedValue<T> = T | Store<T>;

export const toStore = <T>(value: SourcedValue<T>): Store<T> =>
  is.store(value) ? value : (createStore(value) as Store<T>);
