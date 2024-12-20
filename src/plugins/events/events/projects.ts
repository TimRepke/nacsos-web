import type { ProjectModel, ProjectPermissionsModel } from "@/plugins/api/spec/types.gen";
import { BaseEvent } from "@/plugins/events/baseEvent";

export class CurrentProjectSelectedEvent extends BaseEvent {
  constructor(public projectId: string) {
    super();
  }
}

export class CurrentProjectSetEvent extends BaseEvent {
  constructor(
    public project: ProjectModel,
    public permissions: ProjectPermissionsModel,
  ) {
    super();
  }
}
