import { Data } from './Data';
import { normalizeRadical } from './Radicals';
import { IDS } from './IDS';

export type GuessColor = 'absent' | 'present' | 'correct';
export type PreviewColor = 'unknown' | GuessColor;
export type Position = {
  x: number,
  y: number,
  h: number,
  w: number,
};

export type ColoredChar<Color> = { color: Color, char: string };
export type ColorizedIDS<Color> = IDS.Expr<
  ColoredChar<Color>,
  { position: Position }
>;

export type RenderableIDSGuess = ColorizedIDS<GuessColor>;

export type RenderableIDSPreview = ColorizedIDS<PreviewColor>;

export const generateRenderableIDSGuess = (char: string, matchMap: GuessMatches): RenderableIDSGuess => {
  const colorizationScheme = (
    know: GuessCharKnowledge | undefined,
    position: Position): GuessColor => {
    if (!know) { return 'absent'; }
    if (know.positions.some(positionEq(position))) { return 'correct'; }
    return 'present';
  }
  return expandAndColorize(char, matchMap, colorizationScheme);
}

export const generateRenderableIDSPreview = (char: string, matchMap: PreviewMatches): RenderableIDSPreview => {
  const colorizationScheme = (
    know: PreviewCharKnowledge | undefined,
    position: Position): PreviewColor => {
    if (!know) { return 'unknown'; }
    if (know.type === 'absent') { return 'absent'; }
    if (know.knownPositions.some(positionEq(position))) { return 'correct'; }
    return 'present';
  }
  return expandAndColorize(char, matchMap, colorizationScheme);
}

// Determine whether positions are close enough to color green
export const positionEq = ({ x: x1, y: y1, w: w1, h: h1 }: Position) => ({ x: x2, y: y2, w: w2, h: h2 }: Position) => {
  // Could be renamed tbh - this logic used to be exact and is now just comparing corners
  return discretizeAxis(x1, w1) === discretizeAxis(x2, w2) && discretizeAxis(y1, h1) === discretizeAxis(y2, h2);
}

const discretizeAxis = (n: number, d: number): -1 | 0 | 1 | 2 => {
  const l = n;
  const r = n + d;
  if (l === 0 && r === 12) { return 2; }
  if (l === 0) { return -1; }
  if (r === 12) { return 1; }
  return 0;
}

export type GuessCharKnowledge = {
  version: string; // Radical alternative used. If there are multiple of the same character, which I don't think happens, this will cause non-breaking weirdness
  positions: Position[];
};
export type PreviewCharKnowledge = {
  type: 'absent',
} | {
  type: 'present',
  knownPositions: Position[],
};

export type GuessMatches = Record<string, GuessCharKnowledge>;
export type PreviewMatches = Record<string, PreviewCharKnowledge>;

const expandAndColorize = <C, A>(
  char: string,
  matchMap: Record<string, A>,
  colorize: (
    a: A | undefined,
    position: Position) => C,
): ColorizedIDS<C> => {
  const expandedExpression = conditionalExpand(
    { type: 'Leaf', val: char, note: undefined },
    matchMap
  )[1];

  const notedExpression = IDS.mapNotes(expandedExpression, () => ({}));

  const triangulatedExpression = triangulateExpandedExpression(
    notedExpression,
    { x: 0, y: 0, h: 12, w: 12 });

  return colorizeTriangulatedExpression(triangulatedExpression, matchMap, colorize);
}

const conditionalExpand = <A>(
  expr: IDS.Expr<string, undefined>,
  matchMap: Record<string, A>,
): [boolean, IDS.Expr<string, undefined>] => {
  if (expr.type === 'Leaf') {
    if (matchMap[normalizeRadical(expr.val)]) { return [true, expr]; }
    if (!Data.IDSMap[expr.val]) { return [false, expr]; }
    const [matched, exp] = conditionalExpand(Data.IDSMap[expr.val], matchMap);
    if (!matched) { return [false, expr]; }
    return [true, exp];
  }
  const combos = expr.args.map(x =>
    conditionalExpand(x, matchMap));
  const matched = combos.some(x => x[0]);
  const args = combos.map(x => x[1]) as any;
  return [matched, {
    type: expr.type,
    args,
  }];
}

export const triangulateExpandedExpression = <Q extends {}>(
  expr: IDS.Expr<string, Q>,
  { x, y, w, h }: Position
): IDS.Expr<string, Q & { position: Position }> => {
  const note: Q & { position: Position } = {
    ...(expr.note as Q),
    position: { x, y, h, w },
  };
  const strokeCount = getStrokeCount(expr);
  let lf: number;
  let mf: number;
  switch (expr.type) {
    case 'Leaf':
      return {
        ...expr,
        note,
      };
    case '⿰':
      lf = getStrokeCount(expr.args[0]) / strokeCount;
      return {
        ...expr, note, args: [
          triangulateExpandedExpression(expr.args[0], { x, y, w: w * lf, h }),
          triangulateExpandedExpression(expr.args[1], { x: x + w * lf, y, w: w * (1 - lf), h })]
      };
    case '⿱':
      lf = getStrokeCount(expr.args[0]) / strokeCount;
      return {
        ...expr, note, args: [
          triangulateExpandedExpression(expr.args[0], { x, y, w, h: h * lf }),
          triangulateExpandedExpression(expr.args[1], { x, y: y + h * lf, w, h: h * (1 - lf) })]
      };
    case '⿺': return {
      ...expr, note, args: [
        triangulateExpandedExpression(expr.args[0], { x, y, w, h }),
        triangulateExpandedExpression(expr.args[1], { x: x + w / 2, y, w: w / 2, h: h / 2 }),
      ],
    };
    case '⿹': return {
      ...expr, note, args: [
        triangulateExpandedExpression(expr.args[0], { x, y, w, h }),
        triangulateExpandedExpression(expr.args[1], { x, y: y + h / 2, w: w / 2, h: h / 2 }),
      ],
    };
    case '⿸': return {
      ...expr, note, args: [
        triangulateExpandedExpression(expr.args[0], { x, y, w, h }),
        triangulateExpandedExpression(expr.args[1], { x: x + w / 2, y: y + h / 2, w: w / 2, h: h / 2 }),
      ],
    };
    case '⿶': return {
      ...expr, note, args: [
        triangulateExpandedExpression(expr.args[0], { x, y, w, h }),
        triangulateExpandedExpression(expr.args[1], { x: x + w / 3, y, w: w / 3, h: h * 2 / 3 }),
      ],
    };
    case '⿵': return {
      ...expr, note, args: [
        triangulateExpandedExpression(expr.args[0], { x, y, w, h }),
        triangulateExpandedExpression(expr.args[1], { x: x + w / 3, y: y + h / 3, w: w / 3, h: h * 2 / 3 }),
      ],
    };
    case '⿷': return {
      ...expr, note, args: [
        triangulateExpandedExpression(expr.args[0], { x, y, w, h }),
        triangulateExpandedExpression(expr.args[1], { x: x + w / 3, y: y + h / 3, w: w * 2 / 3, h: h / 3 }),
      ],
    };
    case '⿴': return {
      ...expr, note, args: [
        triangulateExpandedExpression(expr.args[0], { x, y, w, h }),
        triangulateExpandedExpression(expr.args[1], { x: x + w / 3, y: y + h / 3, w: w / 3, h: h / 3 }),
      ],
    };
    case '⿲':
      lf = getStrokeCount(expr.args[0]) / strokeCount;
      mf = getStrokeCount(expr.args[1]) / strokeCount;
      return {
        ...expr, note, args: [
          triangulateExpandedExpression(expr.args[0], { x, y, w: w * lf, h }),
          triangulateExpandedExpression(expr.args[1], { x: x + w * lf, y, w: w * mf, h }),
          triangulateExpandedExpression(expr.args[2], { x: x + w * (lf + mf), y, w: w * (1 - lf - mf), h })]
      };
    case '⿳':
      lf = getStrokeCount(expr.args[0]) / strokeCount;
      mf = getStrokeCount(expr.args[1]) / strokeCount;
      return {
        ...expr, note, args: [
          triangulateExpandedExpression(expr.args[0], { x, y, w, h: h * lf }),
          triangulateExpandedExpression(expr.args[1], { x, y: y + h * lf, w, h: h * mf }),
          triangulateExpandedExpression(expr.args[2], { x, y: y + h * (lf + mf), w, h: h * (1 - lf - mf) })]
      };
  }
};

const colorizeTriangulatedExpression = <A, C>(
  expr: IDS.Expr<string, { position: Position }>,
  matchMap: Record<string, A>,
  colorize: (
    a: A | undefined,
    position: Position) => C,
): ColorizedIDS<C> => {
  return IDS.mapLeaves(
    expr,
    (char: string, { position }: { position: Position }): ColoredChar<C> => {
      return { char, color: colorize(matchMap[normalizeRadical(char)], position) };
    });
};

export const getStrokeCount = <A>(expr: IDS.Expr<string, A>): number => {
  if (expr.type === 'Leaf') {
    if (Data.strokeCounts[expr.val] ?? Data.strokeCounts[normalizeRadical(expr.val)]) {
      return Data.strokeCounts[expr.val] ?? Data.strokeCounts[normalizeRadical(expr.val)]
    } else if (Data.IDSMap[expr.val]) {
      const v = getStrokeCount(Data.IDSMap[expr.val]);
      Data.strokeCounts[expr.val] = v;
      return v;
    } else {
      console.error(`Couldn't get stroke count for "${expr.val}"`);
      return 1;
    }
  }
  const subCounts: IDS.ExprF<number, number, A> = IDS.map<IDS.Expr<string, A>, number, number, A>(expr, getStrokeCount);
  if (subCounts.type === 'Leaf') {
    console.error(`Couldn't properly extract stroke counts by expanding ${JSON.stringify(expr)}`);
    return 1;
  }
  return subCounts.args.reduce((x, y) => x + y);
}