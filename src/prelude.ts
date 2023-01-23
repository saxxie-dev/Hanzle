export const assertNever = (shouldBeNever: never) =>
  `Unmatched case: ${shouldBeNever}`;

export type Eq<A, B> = A | B extends A & B ? true : never;

export const recordMap = <A extends string | number | symbol, B, C>(record: Record<A, B>, fn: (b: B) => C): Record<A, C> => {
  const ret: Record<string, C> = {};
  Object.keys(record).forEach(a => ret[a] = fn(record[a as A]));
  return ret as Record<A, C>;
};