import { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Plus, Target } from 'lucide-react';
import { Button } from './components/ui/button';
import { TaskCard } from './components/TaskCard';
import { Slider } from './components/ui/slider';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  timeSpent: number;
  isTracking: boolean;
  startTime: number | null;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [taskCount, setTaskCount] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Initialize tasks based on task count
  useEffect(() => {
    const newTasks: Task[] = [];
    for (let i = 0; i < taskCount; i++) {
      newTasks.push({
        id: i + 1,
        text: '',
        completed: false,
        timeSpent: 0,
        isTracking: false,
        startTime: null
      });
    }
    setTasks(newTasks);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update time spent for tracking tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.isTracking && task.startTime) {
            const elapsed = Math.floor((Date.now() - task.startTime) / 1000);
            return { ...task, timeSpent: elapsed };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTaskCountChange = (value: number[]) => {
    const newCount = value[0];
    setTaskCount(newCount);

    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks];

      if (newCount > prevTasks.length) {
        // Add new tasks
        for (let i = prevTasks.length; i < newCount; i++) {
          updatedTasks.push({
            id: Date.now() + i,
            text: '',
            completed: false,
            timeSpent: 0,
            isTracking: false,
            startTime: null
          });
        }
      } else if (newCount < prevTasks.length) {
        // Remove tasks from the end (only if they're empty)
        return updatedTasks.slice(0, newCount);
      }

      return updatedTasks;
    });
  };

  const startTracking = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id && !task.completed) {
        return {
          ...task,
          isTracking: true,
          startTime: Date.now() - (task.timeSpent * 1000)
        };
      }
      // Stop other tasks
      if (task.isTracking) {
        return { ...task, isTracking: false, startTime: null };
      }
      return task;
    }));
  };

  const pauseTracking = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return { ...task, isTracking: false, startTime: null };
      }
      return task;
    }));
  };

  const completeTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          completed: true,
          isTracking: false,
          startTime: null
        };
      }
      return task;
    }));
  };

  const uncompleteTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          completed: false,
          timeSpent: 0
        };
      }
      return task;
    }));
  };

  const updateTaskText = (id: number, text: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text } : task
    ));
  };

  const addNewTask = () => {
    const newTask: Task = {
      id: Date.now(),
      text: '',
      completed: false,
      timeSpent: 0,
      isTracking: false,
      startTime: null
    };
    setTasks([...tasks, newTask]);
    setTaskCount(tasks.length + 1);
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    setTaskCount(Math.max(1, tasks.length - 1));
  };

  const totalFocusTime = tasks
    .filter(t => t.completed && t.text.trim())
    .reduce((sum, task) => sum + task.timeSpent, 0);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const completedCount = tasks.filter(t => t.completed && t.text.trim()).length;
  const totalTasks = tasks.filter(t => t.text.trim()).length;

  return (
    <div className="min-h-screen transition-all duration-700 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Top Bar */}
      <div className="sticky top-0 z-50 backdrop-blur-2xl bg-white/30 dark:bg-slate-900/30 border-b border-white/20 dark:border-slate-800/20 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900 dark:text-white">Daily Focus Tracker</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-0.5 hidden sm:block">
                  Stay focused, get things done
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 w-10 h-10 sm:w-12 sm:h-12"
            >
              <div className="relative w-6 h-6">
                <Sun className={`absolute inset-0 h-6 w-6 text-yellow-500 transition-all duration-500 ${darkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                  }`} />
                <Moon className={`absolute inset-0 h-6 w-6 text-indigo-400 transition-all duration-500 ${darkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                  }`} />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 sm:py-12 relative z-10">
        {/* Total Focus Time */}
        {totalFocusTime > 0 && (
          <div className="mb-6 sm:mb-8 p-6 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 dark:from-indigo-500/30 dark:to-purple-600/30 backdrop-blur-xl border border-indigo-300/40 dark:border-indigo-700/40 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300">Total Focus Time Today</p>
                  <p className="text-gray-900 dark:text-white mt-1">{formatTime(totalFocusTime)}</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="text-right">
                  <p className="text-gray-600 dark:text-gray-300">Progress</p>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {completedCount} / {totalTasks}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Count Selector */}
        <div className="mb-8 sm:mb-10 p-6 sm:p-8 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/40 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-gray-900 dark:text-white">Daily Tasks</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                How many tasks do you want to focus on today?
              </p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <span className="text-white">{taskCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400 shrink-0">1</span>
            <Slider
              value={[taskCount]}
              onValueChange={handleTaskCountChange}
              min={1}
              max={10}
              step={1}
              className="flex-1"
            />
            <span className="text-gray-600 dark:text-gray-400 shrink-0">10</span>
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onUpdateText={updateTaskText}
              onStart={startTracking}
              onPause={pauseTracking}
              onComplete={completeTask}
              onUncomplete={uncompleteTask}
              onDelete={deleteTask}
              canDelete={tasks.length > 1}
            />
          ))}
        </div>

        {/* Completion Message */}
        {completedCount === totalTasks && totalTasks > 0 && (
          <div className="mt-8 sm:mt-12 p-8 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 backdrop-blur-xl border border-green-300/40 dark:border-green-700/40 text-center shadow-2xl animate-in fade-in zoom-in duration-700">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-gray-900 dark:text-white mb-2">
              All Tasks Completed!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Excellent work! You've completed all your tasks for today.
            </p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      {tasks.length < 10 && (
        <button
          onClick={addNewTask}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl hover:shadow-indigo-500/50 dark:shadow-indigo-900/50 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group z-50"
          aria-label="Add task"
        >
          <Plus className="w-7 h-7 sm:w-8 sm:h-8 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
}