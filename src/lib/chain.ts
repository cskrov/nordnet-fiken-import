export const chain =
  <T>(...fns: ((arg: T) => T)[]) =>
  (arg: T) =>
    fns.reduce((acc, fn) => fn(acc), arg);
