import { Component } from 'vue';
import { ImportType, ProjectType } from '@/plugins/client-core';

export type ComponentMapping = { [key in ImportType]?: [string, Component] };
export type CompatibilityMapping = { [key in ProjectType]: ImportType[] };
