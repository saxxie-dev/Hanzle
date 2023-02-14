import type { GuessOrHint } from "./GameState";
import type { GuessMatches, PreviewMatches } from "./Scoring";
import { getStrokeCount, positionEq } from "./Scoring";


export const giveHint = (secretKnowledge: GuessMatches, publicKnowledge: PreviewMatches): GuessOrHint => {
  // First priority : locate known present spots
  for (const char of Object.keys(publicKnowledge)) {
    const know = publicKnowledge[char];
    if (know.type === "present" && know.knownPositions.length < secretKnowledge[char].positions.length) {
      for (const pos of secretKnowledge[char].positions) {
        if (know.knownPositions.findIndex(positionEq(pos)) === -1) {
          know.knownPositions.push(pos);
          return { type: "Hint", value: secretKnowledge[char].version, position: pos };
        }
      }
    }
  }
  // Second priority : smallest possible radicals;
  const componentsWithStrokeCounts: [string, number][] = Object.keys(secretKnowledge).map(char => [char, getStrokeCount({ type: "Leaf", val: char, note: undefined })]);
  componentsWithStrokeCounts.sort((x, y) => x[1] - y[1]);
  for (const comp of componentsWithStrokeCounts) {
    if (!publicKnowledge[comp[0]]) {
      publicKnowledge[comp[0]] = { type: "present", knownPositions: [] }
      return giveHint(secretKnowledge, publicKnowledge);
    }
  }
  return { type: "Hint", value: undefined!, position: { x: 0, y: 0, w: 0, h: 0 } };
}