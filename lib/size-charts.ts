export type SizeRow = {
  size: string;
  chest: string;
  waist: string;
  hip: string;
};

export const adultChart: SizeRow[] = [
  { size: "XS", chest: "81–86", waist: "66–71", hip: "86–91" },
  { size: "S", chest: "86–91", waist: "71–76", hip: "91–97" },
  { size: "M", chest: "96–101", waist: "81–86", hip: "102–107" },
  { size: "L", chest: "106–112", waist: "91–97", hip: "112–117" },
  { size: "XL", chest: "117–122", waist: "102–107", hip: "122–127" },
  { size: "XXL", chest: "122–127", waist: "107–112", hip: "127–132" },
];

export const girlsChart: SizeRow[] = [
  { size: "10Y", chest: "72–76", waist: "62–66", hip: "76–81" },
  { size: "12Y", chest: "76–81", waist: "64–69", hip: "81–86" },
  { size: "14Y", chest: "81–86", waist: "66–71", hip: "86–91" },
  { size: "16Y", chest: "86–91", waist: "69–74", hip: "91–97" },
];

export const adultInches: SizeRow[] = adultChart.map(toInches);
export const girlsInches: SizeRow[] = girlsChart.map(toInches);

function toInches(row: SizeRow): SizeRow {
  return {
    size: row.size,
    chest: cmRangeToInches(row.chest),
    waist: cmRangeToInches(row.waist),
    hip: cmRangeToInches(row.hip),
  };
}

function cmRangeToInches(range: string): string {
  const [min, max] = range.split("–").map((value) => Number(value));
  if (!min || !max) return range;
  const convert = (cm: number) => Math.round((cm / 2.54) * 10) / 10;
  return `${convert(min)}–${convert(max)}`;
}

export function suggestAdultSize(chestCm: number): string {
  if (chestCm < 86) return "XS";
  if (chestCm < 94) return "S";
  if (chestCm < 104) return "M";
  if (chestCm < 114) return "L";
  if (chestCm < 122) return "XL";
  return "XXL";
}

export function suggestGirlsSize(heightCm: number): string {
  if (heightCm < 146) return "10Y";
  if (heightCm < 156) return "12Y";
  if (heightCm < 164) return "14Y";
  return "16Y";
}
