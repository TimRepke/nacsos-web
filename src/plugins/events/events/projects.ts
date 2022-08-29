/* eslint-disable max-classes-per-file, no-useless-constructor */

import type { ProjectModel, ProjectPermissionsModel } from '@/plugins/api/api-core';
import { BaseEvent } from '@/plugins/events/baseEvent';

export class CurrentProjectSelectedEvent extends BaseEvent {
  constructor(public projectId: string) { super(); }
}

export class CurrentProjectSetEvent extends BaseEvent {
  constructor(public project: ProjectModel, public permissions: ProjectPermissionsModel) { super(); }
}
