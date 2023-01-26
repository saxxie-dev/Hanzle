import { IDS } from './IDS';

const parseIDS_ = (input: string): [IDS.Expr<string>, string] => {
  const h1 = headHas(input, IDS.Combo1_enumeration);
  if (h1) {
    const [arg1, rem] = parseIDS_(input.slice(1));
    return [
      { type: h1, args: [arg1] },
      rem,
    ];
  }

  const h2 = headHas(input, IDS.Combo2_enumeration);
  if (h2) {
    const [arg1, rem1] = parseIDS_(input.slice(1));
    const [arg2, rem] = parseIDS_(rem1);
    return [
      { type: h2, args: [arg1, arg2] },
      rem,
    ];
  }

  const h3 = headHas(input, IDS.Combo3_enumeration);
  if (h3) {
    const [arg1, rem1] = parseIDS_(input.slice(1));
    const [arg2, rem2] = parseIDS_(rem1);
    const [arg3, rem] = parseIDS_(rem2);

    return [
      { type: h3, args: [arg1, arg2, arg3] },
      rem,
    ];
  }
  const [nxt, rem] = matchUnicodeCons(input);
  return [{ type: 'Leaf', val: nxt }, rem];
}

export const parseIDS = (input: string): IDS.Expr<string> => {
  const [parsed, rem] = parseIDS_(input);
  if (rem !== '') { throw `Parser failed to interpret remainder "${rem}" of string "${input}`; }
  return parsed;
}

const matchUnicodeCons = (s: string): [string, string] => {
  const headCodepoint = s.codePointAt(0);
  if (!headCodepoint) {
    throw `Headless string "${s}"`;
  }
  const head = String.fromCodePoint(headCodepoint);
  return [head, s.slice(head.length)];
};

const headHas = <A extends readonly string[]>(search: string, check: A): A[number] | undefined => {
  const head: A[number] = search[0];
  return check.indexOf(search[0]) > -1 ? head : undefined;
};