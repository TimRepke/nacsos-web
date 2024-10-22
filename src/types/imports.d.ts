import { Component } from "vue";
import { ImportModel, ImportRevisionModel, ImportType, ProjectType } from "@/plugins/api/spec/types.gen";

export type ComponentMapping = { [key in ImportType]?: [string, Component] };
export type CompatibilityMapping = { [key in ProjectType]: ImportType[] };
export type Revision = { r: ImportRevisionModel; i: ImportModel };
