import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

type TaskProgress = Record<string, number>;

export type TaskContextType = {
  score: number;
  taskProgress: TaskProgress;
  incrementTask: (id: string, points?: number) => void;
  resetTasks: () => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [taskProgress, setTaskProgress] = useState<TaskProgress>({});
  const [score, setScore] = useState(0);

  // мемоізований інкремент
  const incrementTask = useCallback(
    (id: string, points: number = 1) => {
      setTaskProgress(prev => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
      setScore(prev => prev + points);
    },
    []
  );

  const resetTasks = useCallback(() => {
    setTaskProgress({});
    setScore(0);
  }, []);

  const value = useMemo(
    () => ({ score, taskProgress, incrementTask, resetTasks }),
    [score, taskProgress, incrementTask, resetTasks]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within TaskProvider');
  }
  return context;
};
