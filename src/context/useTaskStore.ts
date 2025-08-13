import { create } from "zustand";
import { Task } from "../types/task";
import { TaskStore } from "../types/taskStore";
import { getToday, getTomorrow } from "../utils/dates";

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [
    {
      id: 1,
      title: "Complete project documentation",
      completed: false,
      priority: "high",
      description: "Write comprehensive docs",
      createdAt: getToday(),
      updatedAt: "",
      container: "daily",
    },
    {
      id: 2,
      title: "Review pull requests",
      completed: true,
      priority: "medium",
      description: "",
      createdAt: getToday(),
      updatedAt: new Date().toISOString(),
      container: "daily",
    },
    {
      id: 3,
      title: "Prepare presentation",
      completed: false,
      priority: "high",
      description: "",
      createdAt: getToday(),
      updatedAt: new Date().toISOString(),
      container: "tomorrow",
    },
    {
      id: 4,
      title: "Team meeting planning",
      completed: false,
      priority: "low",
      description: "",
      createdAt: "2024-12-20",
      updatedAt: new Date().toISOString(),
      container: "planned",
    },
    {
      id: 5,
      title: "Code refactoring",
      completed: true,
      priority: "medium",
      description: "",
      createdAt: "2024-12-18",
      updatedAt: new Date().toISOString(),
      container: "planned",
    },
  ],

  addTask: (task: Task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: getToday() } : task
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  handleToggleCompleted: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  },
}));
