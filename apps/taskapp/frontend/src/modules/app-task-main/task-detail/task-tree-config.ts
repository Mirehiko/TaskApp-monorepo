import { TaskPriority, TaskResponseDto, TaskStatus } from '@taskapp/app-common';
import { IListConfig, ITreeItem } from '../components/list-module/base-list.component';

enum AdditionTaskGroups {
  FINISHED = 'finished',
}

type TaskGroupsByPriority = TaskPriority | AdditionTaskGroups;
const TaskGroupsByPriority = { ...TaskPriority, ...AdditionTaskGroups };

export const taskListConfig: IListConfig = {
  pinnable: true,
  listDescription: [
    {
      field: 'name',
    },
    {
      field: 'createdAt',
    }
  ],
  checkboxOnly: true,
  lockNavigateToItemOnKey: true,
}
