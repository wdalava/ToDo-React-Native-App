import { Task } from "./task";

export interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  handleToggleCompleted: (id: number) => void;
}
