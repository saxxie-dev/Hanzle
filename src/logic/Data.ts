import { recordMap } from '~/prelude';
import * as rawIDSData$ from '../../data/ids.json';
import * as rawCharList$ from '../../data/candidates.json';
import * as rawStrokeCounts$ from '../../data/strokecounts.json';
import { parseIDS } from './Parser';

export namespace Data {
  export const IDSMap = recordMap((rawIDSData$ as any).default as Record<string, string>, parseIDS);
  export const candidates = (rawCharList$ as any).default as string[];
  export const strokeCounts = rawStrokeCounts$;
}