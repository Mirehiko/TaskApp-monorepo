import { TaskPriority, TaskResponseDto, TaskStatus } from '@taskapp/app-common';
import { IListConfig, ITreeItem } from '../components/list-module/base-list.component';

enum AdditionTaskGroups {
  FINISHED = 'finished',
}

type TaskGroupsByPriority = TaskPriority | AdditionTaskGroups;
const TaskGroupsByPriority = { ...TaskPriority, ...AdditionTaskGroups };

export const taskListConfig: IListConfig = {
  groups: [{
    name: 'High',
    type: TaskPriority.HIGH
  },
  {
    name: 'Medium',
    type: TaskPriority.MEDIUM
  },
  {
    name: 'Low',
    type: TaskPriority.LOW
  },
  {
    name: 'None',
    type: TaskPriority.NONE
  }],
  groupDivider(list: ITreeItem<TaskResponseDto>[], priority: TaskGroupsByPriority): ITreeItem<TaskResponseDto>[] {
    return list.filter(task => {
      switch (priority) {
        case TaskGroupsByPriority.FINISHED:
          return [TaskStatus.DONE, TaskStatus.WONT_DO].includes(task.data.status);
        default:
          return task.data.priority === priority;
      }
    });
  },
  pinnable: true,
  listDescription: [
    {
      field: 'name',
    },
    {
      field: 'createdAt',
    }
  ],
  navigateTo: '/taskapp/ttp',
  checkboxOnly: true,
}
