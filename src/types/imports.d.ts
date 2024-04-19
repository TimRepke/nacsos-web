import { Component } from "vue";
import { ImportType, ProjectType } from "@/plugins/api/spec/types.gen";

export type ComponentMapping = { [key in ImportType]?: [string, Component] };
export type CompatibilityMapping = { [key in ProjectType]: ImportType[] };
