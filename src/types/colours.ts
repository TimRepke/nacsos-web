import { AssignmentStatus } from "@/plugins/api/api-core";
import type { AnnotationSchemeLabelChoice } from "@/plugins/api/api-core";

export const cmap = [
  "#e6194B", // # 0
  "#3cb44b", // # 1
  "#ffe119", // # 2
  "#4363d8", // # 3
  "#f58231", // # 4
  "#911eb4", // # 5
  "#42d4f4", // # 6
  "#f032e6", // # 7
  "#bfef45", // # 8
  "#fabed4", // # 9
  "#469990", // # 10
  "#dcbeff", // # 11
  "#9A6324", // # 12
  "#fffac8", // # 13
  "#800000", // # 14
  "#aaffc3", // # 15
  "#808000", // # 16
  "#ffd8b1", // # 17
  "#000075", // # 18
  "#a9a9a9", // # 19
  "#ffffff", // # 20
  "#000000", // # 21
  // even more as a fallback
  "aqua",
  "black",
  "blue",
  "fuchsia",
  "gray",
  "green",
  "lime",
  "maroon",
  "navy",
  "olive",
  "orange",
  "purple",
  "red",
  "silver",
  "teal",
  "yellow",
];

export function lookupMaker<T extends string | number | symbol>(
  colourTable: Record<T, string>,
  cUndefined: string,
  cNull: string,
  cFallback: string,
): (value: T | undefined | null) => string {
  return (value) => {
    if (value === undefined) return cUndefined;
    if (value === null) return cNull;
    if ((value as string | symbol) in colourTable) return colourTable[value];
    return cFallback;
  };
}

export type Extractor<T, R> = (v: T) => R | undefined | null;

export function lookupMakerStatus<T>(extract: Extractor<T, AssignmentStatus>): (v: T) => string {
  const mapper = lookupMaker<AssignmentStatus>(
    {
      [AssignmentStatus.OPEN]: "white",
      [AssignmentStatus.PARTIAL]: "yellow",
      [AssignmentStatus.FULL]: "#42b983",
      [AssignmentStatus.INVALID]: "red",
    },
    "white",
    "white",
    "white",
  );
  return (v: T) => mapper(extract(v));
}

export function lookupMakerChoice<T>(
  choices: AnnotationSchemeLabelChoice[],
  squeeze: boolean,
  extract: Extractor<T, number>,
): (v: T) => string {
  let colourTable: Record<number, string>;

  if (squeeze) {
    colourTable = Object.fromEntries(
      choices
        .map((choice: AnnotationSchemeLabelChoice) => choice.value)
        .sort()
        .map((value: number, idx: number): [number, string] => {
          const altValue: number = idx % Object.keys(cmap).length;
          return [value, cmap[altValue]];
        }),
    );
  } else {
    colourTable = Object.fromEntries(
      choices.map((choice: AnnotationSchemeLabelChoice): [number, string] => {
        const altValue: number = (choice.value as number) % Object.keys(cmap).length;
        return [choice.value, cmap[altValue]];
      }),
    );
  }
  const mapper = lookupMaker<number>(colourTable, "white", "white", "white");
  return (v: T) => mapper(extract(v));
}

export function lookupMakerBool<T>(extract: Extractor<T, boolean>): (v: T) => string {
  /* @ts-ignore: TS2344 */
  const mapper = lookupMaker<boolean>(
    {
      false: "#C54B6C",
      true: "#8DA47E",
    },
    "white",
    "white",
    "white",
  );
  return (v: T) => mapper(extract(v));
}
