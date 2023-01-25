import { IDS } from "./types";
import * as rawData$ from '../idsMapData.json';
import { recordMap } from "~/prelude";
import { parseIDS } from "./parser";


export namespace Queries {
  const IDSMap = recordMap((rawData$ as any).default as Record<string, string>, parseIDS);

  const expand1 = (expr: IDS.Expr<string>): IDS.Expr<string> => {
    if (expr.type === 'Leaf') {
      return IDSMap[expr.val] || expr;
    }
    return expr;
  }

  export const expand = (expr: IDS.Expr<string>): IDS.Expr<string> => {
    return IDS.map(expand1(expr), expand);
  }

  export const findComponents = (char: string): Set<string> => {
    const components: Set<string> = new Set();
    const componentExpand1 = (expr: IDS.Expr<string>): IDS.Expr<string> => {
      if (expr.type === 'Leaf') {
        components.add(expr.val);
        return IDSMap[expr.val] || expr;
      }
      return expr;
    }
    const componentExpand = (expr: IDS.Expr<string>): IDS.Expr<string> => {
      return IDS.map(componentExpand1(expr), componentExpand);
    }
    componentExpand({ type: 'Leaf', val: char });
    console.log(components);
    return components;
  }

  export const randomChar = (): string => {
    const allChars = Object.keys(IDSMap);
    return allChars[Math.floor(Math.random() * allChars.length)];
  }

  export type Position = {
    x: number,
    y: number,
    h: number,
    w: number,
  }

  export const annotatePositions = (
    expr: IDS.Expr<string>,
    { x, y, w, h }: Position): IDS.Expr<string, Position> => {
    switch (expr.type) {
      case 'Leaf': return { ...expr, note: { x, y, w, h } };
      case '⿰': return {
        ...expr, note: { x, y, w, h }, args: [
          annotatePositions(expr.args[0], { x, y, w: w / 2, h }),
          annotatePositions(expr.args[1], { x: x + w / 2, y, w: w / 2, h })]
      };
      case '⿱': return {
        ...expr, note: { x, y, w, h }, args: [
          annotatePositions(expr.args[0], { x, y, w, h: h / 2 }),
          annotatePositions(expr.args[1], { x, y: y + h / 2, w, h: h / 2 })]
      };
      case '⿲': return {
        ...expr, note: { x, y, w, h }, args: [
          annotatePositions(expr.args[0], { x, y, w: w / 3, h }),
          annotatePositions(expr.args[1], { x: x + w / 3, y, w: w / 3, h }),
          annotatePositions(expr.args[2], { x: x + 2 * w / 3, y, w: w / 3, h })]
      };
      case '⿳': return {
        ...expr, note: { x, y, w, h }, args: [
          annotatePositions(expr.args[0], { x, y, w, h: h / 3 }),
          annotatePositions(expr.args[1], { x, y: y + h / 3, w, h: h / 3 }),
          annotatePositions(expr.args[2], { x, y: y + 2 * h / 3, w, h: h / 3 })]
      };
    }
  };

  export const findComponentPositions = (char: string, pos: Position): Record<string, Position> => {
    const componentPositions: Record<string, Position> = {};
    const componentPosExpand = (
      expr: IDS.Expr<string>,
      { x, y, w, h }: Position): IDS.Expr<string, Position> => {
      switch (expr.type) {
        case 'Leaf':
          componentPositions[expr.val] = { x, y, w, h };
          if (IDSMap[expr.val]) { return componentPosExpand(IDSMap[expr.val], { x, y, w, h }); }
          return { ...expr, note: { x, y, w, h } };
        case '⿰': return {
          ...expr, note: { x, y, w, h }, args: [
            componentPosExpand(expr.args[0], { x, y, w: w / 2, h }),
            componentPosExpand(expr.args[1], { x: x + w / 2, y, w: w / 2, h })]
        };
        case '⿱': return {
          ...expr, note: { x, y, w, h }, args: [
            componentPosExpand(expr.args[0], { x, y, w, h: h / 2 }),
            componentPosExpand(expr.args[1], { x, y: y + h / 2, w, h: h / 2 })]
        };
        case '⿲': return {
          ...expr, note: { x, y, w, h }, args: [
            componentPosExpand(expr.args[0], { x, y, w: w / 3, h }),
            componentPosExpand(expr.args[1], { x: x + w / 3, y, w: w / 3, h }),
            componentPosExpand(expr.args[2], { x: x + 2 * w / 3, y, w: w / 3, h })]
        };
        case '⿳': return {
          ...expr, note: { x, y, w, h }, args: [
            componentPosExpand(expr.args[0], { x, y, w, h: h / 3 }),
            componentPosExpand(expr.args[1], { x, y: y + h / 3, w, h: h / 3 }),
            componentPosExpand(expr.args[2], { x, y: y + 2 * h / 3, w, h: h / 3 })]
        };
      }
    }
    componentPosExpand({ type: 'Leaf', val: char }, pos);
    return componentPositions;
  };

  export type LeafMatch = 'Idk' | 'Nope' | 'Partial' | 'Full';

}