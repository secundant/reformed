export const createKind = <T>(name: string) => {
  const value = Symbol(name);

  return {
    get value() {
      return value;
    },
    is: (target: any): target is T => isKind(target, value)
  };
};
export const isKind = (value: any, kind: symbol) => value?.__?.kind === kind;
