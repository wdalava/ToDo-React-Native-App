export type Task = {
  id: number;
  title: string;
  priority: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
  container: string;
};
