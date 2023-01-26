import { recordMap } from '~/prelude';
import * as rawIDSData$ from '../idsMapData.json';
import * as rawCharList$ from '../candidateCharacterListData.json';
import { parseIDS } from './Parser';

export namespace Data {
  export const IDSMap = recordMap((rawIDSData$ as any).default as Record<string, string>, parseIDS);
  export const candidates = (rawCharList$ as any).default as string[];

}