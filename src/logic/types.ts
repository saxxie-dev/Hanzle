import { Eq, CleanOptional } from '../prelude';

export namespace IDS {
  // TODO: Uncomment extras below to expand list of allowed combinations.
  export const Combo1_enumeration = [] as never[]; //'〾', '↔', '↷', '⊖'] as const;
  export const Combo2_enumeration = ['⿰', '⿱'] as const; //, '⿴', '⿵', '⿶', '⿷', '⿸', '⿹', '⿺', '⿻'] as const;
  export const Combo3_enumeration = ['⿲', '⿳'] as const;


  export type Combo1 = (typeof Combo1_enumeration)[number];
  export type Combo2 = (typeof Combo2_enumeration)[number];
  export type Combo3 = (typeof Combo3_enumeration)[number];

  export type Expr<L, N = undefined> =
    ({ type: Combo1, args: [Expr<L, N>] } |
    { type: Combo2, args: [Expr<L, N>, Expr<L, N>] } |
    { type: Combo3, args: [Expr<L, N>, Expr<L, N>, Expr<L, N>] } |
    { type: 'Leaf', val: L }) & CleanOptional<'note', N>;

  export type ExprF<A, L, N = undefined> =
    ({ type: Combo1, args: [A] } |
    { type: Combo2, args: [A, A] } |
    { type: Combo3, args: [A, A, A] } |
    { type: 'Leaf', val: L }) & CleanOptional<'note', N>;

  const witness_Expr_is_Fix_ExprF:
    <L, N>() => Eq<Expr<L, N>, ExprF<Expr<L, N>, L, N>> = () => true;

  export const map = <A, B, L>(expr: ExprF<A, L>, f: (a: A) => B): ExprF<B, L> => {
    if (expr.type === 'Leaf') {
      return expr;
    }
    return {
      ...expr,
      args: expr.args.map(f) as any, // TS doesn't know length of map return
    }
  }

  // export const mapLeaves = <L, M, N>(expr: Expr<L, N>, f: (l: L) => M): Expr<M, N> => {
  //   if (expr.type === 'Leaf') {
  //     return { ...expr, val: f(expr.val) };
  //   }
  //   return { ...expr, args: expr.args.map(x => mapLeaves(x, f)) as any }
  // }

  // export const cata = <A, L>(expr: Expr<L>, f: (e: ExprF<A, L>) => A): A => {
  //   return f(map<Expr<L>, A, L>(expr, x => cata<A, L>(x, f)));
  // };

  // export const ana = <A, L>(a: A, f: (a: A) => ExprF<A, L>): Expr<L> => {
  //   return map<A, Expr<L>, L>(f(a), x => ana(x, f));
  // }
}

