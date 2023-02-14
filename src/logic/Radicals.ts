export const radicalMap: Record<string, string> = {
  "𠆢": "人",
  "亻": "人",
  "氵": "水",
  "釒": "金",
  "牜": "牛",
  "钅": "金",
  "扌": "手",
  "犭": "犬",
  "⺼": "肉",
  "訁": "言",
  "讠": "言",
  "糹": "糸",
  "纟": "糸",
  "飠": "食",
  "饣": "食",
  "㣺": "心",
  "忄": "心",
  "⺗": "心",
  "礻": "示",
  "衤": "衣",
  "艹": "艸",
  "灬": "火",
  "䒑": "艸",
  "𥫗": "竹",
  "⺶": "羊",
  "辶": "辵",
  // "阝": "阜", // Also is 邑 when on RHS
  "刂": "刀",
  "爫": "爪",
  "𤣩": "玉",
  "⺆": "冂",
  "囗": "口",
};

export const normalizeRadical = (r: string): string => {
  if (radicalMap[r]) { return radicalMap[r]; }
  return r;
}

export const unifyRadical = <A>(record: Record<string, A>, radical: string): A => {
  if (radicalMap[radical] && record[radicalMap[radical]]) { return record[radicalMap[radical]]; }
  return record[radical];
}

export enum SmallRadicalClass {
  top,
  left,
  right,
  bottom,
}

export const SmallRadicals: Record<string, SmallRadicalClass> = {
  "𠆢": SmallRadicalClass.top,
  "亻": SmallRadicalClass.left,
  "氵": SmallRadicalClass.left,
  "釒": SmallRadicalClass.left,
  "牜": SmallRadicalClass.left,
  "钅": SmallRadicalClass.left,
  "扌": SmallRadicalClass.left,
  "犭": SmallRadicalClass.left,
  "訁": SmallRadicalClass.left,
  "讠": SmallRadicalClass.left,
  "糹": SmallRadicalClass.left,
  "纟": SmallRadicalClass.left,
  "飠": SmallRadicalClass.left,
  "饣": SmallRadicalClass.left,
  "㣺": SmallRadicalClass.left,
  "忄": SmallRadicalClass.left,
  "⺗": SmallRadicalClass.bottom,
  "礻": SmallRadicalClass.left,
  "衤": SmallRadicalClass.left,
  "艹": SmallRadicalClass.top,
  "灬": SmallRadicalClass.bottom,
  "䒑": SmallRadicalClass.top,
  "𥫗": SmallRadicalClass.top,
  "阝": SmallRadicalClass.left,
  "刂": SmallRadicalClass.right,
  "爫": SmallRadicalClass.top,
  "宀": SmallRadicalClass.top,
  "冖": SmallRadicalClass.top,
  "龸": SmallRadicalClass.top,
  "⺈": SmallRadicalClass.top,
  "龶": SmallRadicalClass.top,
  "丷": SmallRadicalClass.top,
  "亠": SmallRadicalClass.top,
  "罒": SmallRadicalClass.top,
  "⺌": SmallRadicalClass.top,
  "乛": SmallRadicalClass.top,
  "𠂉": SmallRadicalClass.top,
  "龹": SmallRadicalClass.top,
  "𡗗": SmallRadicalClass.top,
  "耂": SmallRadicalClass.top,
  "𭕄": SmallRadicalClass.top,
};