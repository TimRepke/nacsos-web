import { Component } from 'vue';
import {
  ImportType,
  ProjectType,
} from '@/plugins/client-core';

export type ComponentMapping = { [key in ImportType]?: [string, Component] };
export type CompatibilityMapping = { [key in ProjectType]: ImportType[] };

export const projectTypeImportTypeCompatibility: CompatibilityMapping = {
  basic: ['csv', 'jsonl', 'script'],
  academic: ['ris', 'csv', 'jsonl', 'script', 'wos', 'scopus', 'ebsco', 'jstor', 'ovid', 'pop'],
  patents: ['csv', 'jsonl', 'script'],
  twitter: ['csv', 'jsonl', 'script', 'twitter'],
};
