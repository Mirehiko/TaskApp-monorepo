import { ListItemOption } from '../components/list-module/base-list.component';

export enum TaskAction {
  FOCUS = 'focus',
  CONVERT_TO_TEXT = 'convertToText',
  CONVERT_TO_TASK = 'convertToTask',
}

export const TaskListMenuAction = { ...TaskAction, ...ListItemOption };
export type TaskListMenuAction = TaskAction | ListItemOption;
