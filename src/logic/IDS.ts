import { Eq } from '../prelude';

export namespace IDS {
  // TODO: Uncomment extras below to expand list of allowed combinations.
  export const Combo1_enumeration = [] as never[]; //'〾', '↔', '↷', '⊖'] as const;
  export const Combo2_enumeration = ['⿰', '⿱', '⿴', '⿵', '⿶', '⿷', '⿸', '⿹', '⿺'] as const;// , '⿻'] as const;
  export const Combo3_enumeration = ['⿲', '⿳'] as const;


  export type Combo1 = (typeof Combo1_enumeration)[number];
  export type Combo2 = (typeof Combo2_enumeration)[number];
  export type Combo3 = (typeof Combo3_enumeration)[number];

  type Note<T> = T extends undefined | null ? { note?: T } : { note: T }
  export type Expr<L, N = undefined> =
    ({ type: Combo1, args: [Expr<L, N>] } |
    { type: Combo2, args: [Expr<L, N>, Expr<L, N>] } |
    { type: Combo3, args: [Expr<L, N>, Expr<L, N>, Expr<L, N>] } |
    { type: 'Leaf', val: L }) & Note<N>;

  export type ExprF<A, L, N = undefined> =
    ({ type: Combo1, args: [A] } |
    { type: Combo2, args: [A, A] } |
    { type: Combo3, args: [A, A, A] } |
    { type: 'Leaf', val: L }) & Note<N>;

  const witness_Expr_is_Fix_ExprF:
    <L, N>() => Eq<Expr<L, N>, ExprF<Expr<L, N>, L, N>> = () => true;

  export const map = <A, B, L, N>(expr: ExprF<A, L, N>, f: (a: A) => B): ExprF<B, L, N> => {
    switch (expr.type) {
      case 'Leaf':
        return expr;
      case '⿰':
      case '⿱':
      case '⿺':
      case '⿹':
      case '⿸':
      case '⿶':
      case '⿵':
      case '⿷':
      case '⿴':
        return {
          type: expr.type,
          note: expr.note,
          args: expr.args.map(f) as [B, B], // TS doesn't know length of map return
        }
      case '⿲':
      case '⿳':
        return {
          type: expr.type,
          note: expr.note,
          args: expr.args.map(f) as [B, B, B], // TS doesn't know length of map return
        }
    }
  }

  export const mapLeaves = <A, B, N>(expr: Expr<A, N>, f: (a: A, n: N) => B): Expr<B, N> => {
    if (expr.type === 'Leaf') { return { type: 'Leaf', val: f(expr.val, expr.note!), note: expr.note }; }
    return map<Expr<A, N>, Expr<B, N>, B, N>(expr, x => mapLeaves(x, f));
  }

  export const mapNotes = <A, M, N>(expr: Expr<A, M>, f: (m: M) => N): Expr<A, N> => {
    switch (expr.type) {
      case 'Leaf':
        return { type: expr.type, val: expr.val, note: f(expr.note!) };
      case '⿰':
      case '⿱':
      case '⿺':
      case '⿹':
      case '⿸':
      case '⿶':
      case '⿵':
      case '⿷':
      case '⿴':
        return {
          type: expr.type,
          note: f(expr.note!),
          args: expr.args.map(x => mapNotes(x, f)) as [Expr<A, N>, Expr<A, N>], // TS doesn't know length of map return
        }
      case '⿲':
      case '⿳':
        return {
          type: expr.type,
          note: f(expr.note!),
          args: expr.args.map(x => mapNotes(x, f)) as [Expr<A, N>, Expr<A, N>, Expr<A, N>], // TS doesn't know length of map return
        }
    }
  }
}
