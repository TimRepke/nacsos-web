import { ItemModel, TwitterItemModel, AcademicItemModel } from "@/plugins/api/api-core";

export type BaseItem = ItemModel & { meta: Record<string, unknown> };

export type AnyItem = BaseItem | TwitterItemModel | AcademicItemModel;

// hl = highlighter; sn = "snippet"
type TextSpanMeta = {
  kind: "hl" | "sn";
  ot: string;
  ref: string;
  style?: string | null;
  cb?: () => void;
  snipped_id?: string;
};
type TextSpan = { start: number; end: number } & TextSpanMeta;
type TextSpanI = { type: "start" | "end"; di: number } & TextSpan;
type OpenTextSpan = { openLevel: number } & TextSpanI;
type TextBit = { txt: string } & OpenTextSpan;
type SnippetModel = { snippet_id: string; item_id: string; offset_start: number; offset_end: number; snippet: string };
