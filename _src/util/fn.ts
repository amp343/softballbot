import R from "ramda";

export const mapIndexed = R.addIndex(R.map);

export const program
  : (f: (...args: any[]) => any, ...list: Array<(x: any) => any>) => (acc?: any) => any
  = (f, ...list) => (acc) =>
    [f, ...list].reduce((c, fn) => c.then(fn), Promise.resolve(acc));

export const valueOr =
  R.curry((val: string, x: string): string => val ? val : x);
