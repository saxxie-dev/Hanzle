import { Data } from './Data';
import { normalizeRadical } from './Equivalences';
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

export const positionEq = ({ x: x1, y: y1, w: w1, h: h1 }: Position) => ({ x: x2, y: y2, w: w2, h: h2 }: Position) => {
  return x1 === x2 && y1 === y2 && w1 === w2 && h1 === h2;
}

export type GuessCharKnowledge = {
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
  switch (expr.type) {
    case 'Leaf':
      return {
        ...expr,
        note,
      };
    case '⿰':
      return {
        ...expr, note, args: [
          triangulateExpandedExpression(expr.args[0], { x, y, w: w / 2, h }),
          triangulateExpandedExpression(expr.args[1], { x: x + w / 2, y, w: w / 2, h })]
      };
    case '⿱': return {
      ...expr, note, args: [
        triangulateExpandedExpression(expr.args[0], { x, y, w, h: h / 2 }),
        triangulateExpandedExpression(expr.args[1], { x, y: y + h / 2, w, h: h / 2 })]
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
    case '⿲': return {
      ...expr, note, args: [
        triangulateExpandedExpression(expr.args[0], { x, y, w: w / 3, h }),
        triangulateExpandedExpression(expr.args[1], { x: x + w / 3, y, w: w / 3, h }),
        triangulateExpandedExpression(expr.args[2], { x: x + 2 * w / 3, y, w: w / 3, h })]
    };
    case '⿳': return {
      ...expr, note, args: [
        triangulateExpandedExpression(expr.args[0], { x, y, w, h: h / 3 }),
        triangulateExpandedExpression(expr.args[1], { x, y: y + h / 3, w, h: h / 3 }),
        triangulateExpandedExpression(expr.args[2], { x, y: y + 2 * h / 3, w, h: h / 3 })]
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

