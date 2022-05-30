/* eslint-disable max-classes-per-file, no-useless-constructor */

import type { Project, ProjectPermissions } from '@/types/project.d';
import { BaseEvent } from '@/plugins/events/baseEvent';

export class CurrentProjectSelectedEvent extends BaseEvent {
  constructor(public projectId: string) { super(); }
}

export class CurrentProjectSetEvent extends BaseEvent {
  constructor(public project: Project, public permissions: ProjectPermissions) { super(); }
}
