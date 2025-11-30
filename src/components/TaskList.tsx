import { CheckCircle2, Circle, Play, Pause, Timer } from 'lucide-react';
import { Button } from './ui/button';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  timeSpent: number;
  isTracking: boolean;
  startTime: number | null;
}

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onUpdateText: (id: number, text: string) => void;
  onStartTracking: (id: number) => void;
}

export function TaskList({ tasks, onToggle, onUpdateText, onStartTracking }: TaskListProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
      <h2 className="text-gray-900 dark:text-white mb-4">Top 3 Tasks Today</h2>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={task.id} className="flex items-start gap-3 group">
            <button
              onClick={() => onToggle(task.id)}
              className="mt-1 flex-shrink-0 text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
              disabled={task.isTracking}
            >
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={task.text}
                onChange={(e) => onUpdateText(task.id, e.target.value)}
                placeholder={`Task ${index + 1}`}
                className={`w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-2 px-1 outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                  task.completed ? 'line-through opacity-60' : ''
                }`}
              />
              <div className="flex items-center justify-between gap-2">
                {task.text.trim() && !task.completed && (
                  <Button
                    onClick={() => onStartTracking(task.id)}
                    size="sm"
                    variant={task.isTracking ? "default" : "outline"}
                    className={`rounded-full ${
                      task.isTracking 
                        ? 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white' 
                        : 'bg-white/80 dark:bg-gray-700/80'
                    }`}
                  >
                    {task.isTracking ? (
                      <>
                        <Pause className="w-3 h-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        {task.timeSpent > 0 ? 'Resume' : 'Start'}
                      </>
                    )}
                  </Button>
                )}
                {(task.timeSpent > 0 || task.isTracking) && (
                  <div className={`flex items-center gap-1 ${
                    task.isTracking ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    <Timer className="w-4 h-4" />
                    <span className="tabular-nums">{formatTime(task.timeSpent)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}