export const True = () => true;
export const False = () => false;

export const some =
  <F extends (value: any) => any>(predicate: F) =>
  (values: Parameters<F>[0][]) =>
    values.some(predicate);

export const isEmptyArray = (list: unknown[]) => list.length === 0;
export const concat = <T>(left: T[], right: T[]) => left.concat(right);
