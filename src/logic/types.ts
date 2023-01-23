import { Eq, assertNever } from '../prelude';

export module IDS {
  // TODO: Uncomment extras below to expand list of allowed combinations.
  export const Combo1_enumeration = [] as never[]; //'〾', '↔', '↷', '⊖'] as const;
  export const Combo2_enumeration = ['⿰', '⿱'] as const; //, '⿴', '⿵', '⿶', '⿷', '⿸', '⿹', '⿺', '⿻'] as const;
  export const Combo3_enumeration = ['⿲', '⿳'] as const;


  export type Combo1 = (typeof Combo1_enumeration)[number];
  export type Combo2 = (typeof Combo2_enumeration)[number];
  export type Combo3 = (typeof Combo3_enumeration)[number];

  export type Expr<L> =
    [Combo1, Expr<L>] |
    [Combo2, Expr<L>, Expr<L>] |
    [Combo3, Expr<L>, Expr<L>, Expr<L>] |
    L;

  export type ExprF<A, L> =
    [Combo1, A] |
    [Combo2, A, A] |
    [Combo3, A, A, A] |
    L;

  const witness_Expr_is_Fix_ExprF:
    <L>() => Eq<Expr<L>, ExprF<Expr<L>, L>> = () => true;

  export const map = <A, B, L>(expr: ExprF<A, L>, f: (a: A) => B): ExprF<B, L> => {
    if (!Array.isArray(expr)) {
      return expr;
    }
    if (expr.length === 2) {
      return [expr[0], f(expr[1])];
    }
    if (expr.length === 3) {
      return [expr[0], f(expr[1]), f(expr[2])];
    }
    if (expr.length === 4) {
      return [expr[0], f(expr[1]), f(expr[2]), f(expr[3])];
    }
    throw assertNever(expr);
  }

  export const mapLeaves = <L, M>(expr: Expr<L>, f: (l: L) => M): Expr<M> => {
    if (!Array.isArray(expr)) {
      return f(expr);
    }
    if (expr.length === 2) {
      return [expr[0], mapLeaves(expr[1], f)];
    }
    if (expr.length === 3) {
      return [expr[0], mapLeaves(expr[1], f), mapLeaves(expr[2], f)];
    }
    if (expr.length === 4) {
      return [expr[0], mapLeaves(expr[1], f), mapLeaves(expr[2], f), mapLeaves(expr[3], f)];
    }
    throw assertNever(expr);
  }

  export const cata = <A, L = string>(expr: Expr<L>, f: (e: ExprF<A, L>) => A): A => {
    return f(map<Expr<L>, A, L>(expr, x => cata<A, L>(x, f)));
  };

  export const ana = <A, L>(a: A, f: (a: A) => ExprF<A, L>): Expr<L> => {
    return map<A, Expr<L>, L>(f(a), x => ana(x, f));
  }
};

