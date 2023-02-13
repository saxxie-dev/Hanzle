export const radicalMap: Record<string, string> = {
  "亻": "人",
  "𠆢": "人",
  "灬": "火",
  "氵": "水",
  "釒": "金",
  "钅": "金",
  "扌": "手",
  "艹": "艸",
  "䒑": "艸",
  "𥫗": "竹",
  "⺼": "肉",
  "訁": "言",
  "讠": "言",
  "糹": "糸",
  "纟": "糸",
  "⺶": "羊",
  "飠": "食",
  "饣": "食",
  "牜": "牛",
  "𤣩": "玉",
  "犭": "犬",
  "衤": "衣",
  "礻": "示",
  "辶": "辵",
  // "阝": "阜", // Also is 邑 when on RHS
  "刂": "刀",
  "忄": "心",
  "⺗": "心",
  "㣺": "心",
  "爫": "爪",
  "⺆": "冂",
  "囗": "口",
};

export const normalizeRadical = (r: string): string => {
  if (radicalMap[r]) { return radicalMap[r]; }
  return r;
}

// const halfsizeRadicals = "艹讠扌".split("");