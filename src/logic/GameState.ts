import { Data } from "./Data";
import { normalizeRadical } from "./Radicals";
import { IDS } from "./IDS";
import type { GuessMatches, Position, PreviewMatches } from "./Scoring";
import { positionEq, triangulateExpandedExpression } from "./Scoring";

export type GuessOrHint =
  { type: "Guess", value: string } |
  { type: "Hint", value: string, position: Position };

export type GameState = {
  secret: string;
  secretKnowledge: GuessMatches;
  publicKnowledge: PreviewMatches;
  previousGuesses: GuessOrHint[];
}
export const generateFreshGameState = (): GameState => {
  const secret = getRandomCharacter();
  return {
    secret: secret,
    secretKnowledge: getSecretKnowledge(secret),
    publicKnowledge: {},
    previousGuesses: [],
  };
}

const getRandomCharacter = (): string => {
  const candidate = Data.candidates[Math.floor(Math.random() * Data.candidates.length)];
  if (Data.IDSMap[candidate]) { return candidate; }
  return getRandomCharacter();
}

const annotateAndExpand = (c: string): IDS.Expr<string, { original?: string }> => {
  const note = { original: c };
  if (!Data.IDSMap[c]) { return { type: 'Leaf', val: c, note }; }
  const recExpand = (expr: IDS.Expr<string, undefined>): IDS.Expr<string, { original?: string }> => {
    if (expr.type === 'Leaf') {
      return annotateAndExpand(expr.val);
    }
    return IDS.map<IDS.Expr<string, undefined>, IDS.Expr<string, { original?: string }>, string, { original?: string }>(
      { ...expr, note: {} }, recExpand);
  }
  return { ...recExpand(Data.IDSMap[c]), note };
};

const getSecretKnowledge = (c: string): GuessMatches => {
  const expanded = annotateAndExpand(c);
  const triangulated = triangulateExpandedExpression(expanded, { x: 0, y: 0, h: 12, w: 12 });
  return extractGuessMatches(triangulated);
};

const extractGuessMatches = (e: IDS.Expr<string, { original?: string, position: Position }>): GuessMatches => {
  const paraState: GuessMatches = {};
  const trav = (expr: IDS.Expr<string, { original?: string, position: Position }>): void => {
    if (expr.note.original) {
      const normalized = normalizeRadical(expr.note.original);
      if (!paraState[normalized]) {
        paraState[normalized] = { version: expr.note.original, positions: [] };
      }
      paraState[normalized].positions.push(expr.note.position);
    }
    IDS.map(expr, trav);
  };
  trav(e);
  return paraState
};

export const updatePreviewMap = (previewMap: PreviewMatches, secrets: GuessMatches, char: string): PreviewMatches => {
  const expanded = annotateAndExpand(char);
  const triangulated = triangulateExpandedExpression(expanded, { x: 0, y: 0, h: 12, w: 12 });
  const paraState: PreviewMatches = { ...previewMap };
  const trav = (expr: IDS.Expr<string, { original?: string, position: Position }>): boolean => {
    if (expr.note.original) {
      const normog = normalizeRadical(expr.note.original);
      if (secrets[normog]) {
        const prevMatch = paraState[normog];
        if (prevMatch?.type === "absent") { throw `Error: absent match ${expr.note.original} reappeared`; }
        const prevPositions: Position[] = prevMatch?.knownPositions ?? [];
        if (secrets[normog].positions.findIndex(positionEq(expr.note.position)) > -1) {
          paraState[normog] = { type: "present", knownPositions: [...prevPositions, expr.note.position] };
        } else {
          paraState[normog] = { type: "present", knownPositions: prevPositions };
        }
        IDS.map(expr, trav);
        return true;
      } else {
        const submatches = IDS.map(expr, trav);
        if (submatches.type !== "Leaf" && submatches.args.some(x => x)) {
          return true
        } else {
          paraState[normog] = { type: "absent" };
          return false;
        }
      }
    }
    const submatches = IDS.map(expr, trav);
    if (submatches.type !== "Leaf") {
      return submatches.args.some(x => x);
    }
    return false;
  };
  trav(triangulated);
  return paraState;
}

const countGuessesAndHints = (previousGuesses: GuessOrHint[]): { guesses: number, hints: number } => {
  const ret = { guesses: 0, hints: 0 };
  previousGuesses.forEach(gh => {
    if (gh.type === "Guess") {
      ret.guesses += 1;
    } else {
      ret.hints += 1;
    }
  });
  return ret;
}