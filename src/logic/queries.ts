import { IDS } from "./types";
import * as rawData$ from '../idsMapData.json';
import { recordMap } from "~/prelude";
import { parseIDS } from "./parser";


export module Queries {
  const IDSMap = recordMap((rawData$ as any).default as Record<string, string>, parseIDS);

  export const expand = (char: IDS.Expr<string>): IDS.Expr<string> => IDS.ana(
    char,
    (expr: IDS.Expr<string>): IDS.Expr<string> => {
      if (typeof expr === 'string') {
        return IDSMap[expr] || expr;
      }
      return expr;
    })

  // Give locations and sizes of every subcharacter
  // export const annotatePositions = (char)


}