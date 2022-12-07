/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ItemType } from './ItemType';

/**
 * Project is the basic structural and conceptual place around which all functionality evolves.
 * It is essentially a container for a logically connected set of analyses, e.g. all work for a paper.
 *
 * Although Items (and subsequently their type-specific extensions) live outside the scope of a project,
 * they way they are augmented by annotations and analysis outcomes is always constrained to the scope
 * of a Project.
 */
export type ProjectModel = {
  project_id?: string;
  name: string;
  description?: string;
  type: ('generic' | 'twitter' | 'academic' | 'patents' | ItemType);
};

