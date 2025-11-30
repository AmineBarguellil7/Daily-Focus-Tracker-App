import { useState } from "react";
import {
  CheckCircle2,
  Play,
  Pause,
  Timer,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { Button } from "./ui/button";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  timeSpent: number;
  isTracking: boolean;
  startTime: number | null;
}

interface TaskCardProps {
  task: Task;
  index: number;
  onUpdateText: (id: number, text: string) => void;
  onStart: (id: number) => void;
  onPause: (id: number) => void;
  onComplete: (id: number) => void;
  onUncomplete: (id: number) => void;
  onDelete: (id: number) => void;
  canDelete: boolean;
}

export function TaskCard({
  task,
  index,
  onUpdateText,
  onStart,
  onPause,
  onComplete,
  onUncomplete,
  onDelete,
  canDelete,
}: TaskCardProps) {
  const [isFocused, setIsFocused] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div
      className={`group relative p-6 sm:pb-2 rounded-3xl backdrop-blur-xl border transition-all duration-500 animate-in fade-in zoom-in ${
        task.completed
          ? "bg-gradient-to-br from-green-500/15 to-emerald-500/15 dark:from-green-500/25 dark:to-emerald-500/25 border-green-300/50 dark:border-green-700/50 shadow-xl shadow-green-500/10"
          : task.isTracking
            ? "bg-gradient-to-br from-indigo-500/15 to-purple-600/15 dark:from-indigo-500/25 dark:to-purple-600/25 border-indigo-300/50 dark:border-indigo-700/50 shadow-2xl shadow-indigo-500/20"
            : "bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800/40 shadow-lg hover:shadow-xl hover:bg-white/70 dark:hover:bg-slate-900/70"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Task Number Badge */}
      <div
        className={`absolute -top-3 -left-3 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
          task.completed
            ? "bg-gradient-to-br from-green-500 to-emerald-600"
            : "bg-gradient-to-br from-indigo-500 to-purple-600"
        }`}
      >
        {task.completed ? (
          <CheckCircle2 className="w-5 h-5 text-white" />
        ) : (
          <span className="text-white">{index + 1}</span>
        )}
      </div>

      {/* Delete Button - Only show if empty and can delete */}
      {canDelete &&
        task.text.trim() === "" &&
        !task.completed && (
          <button
            onClick={() => onDelete(task.id)}
            className="absolute -top-3 -right-3 w-9 h-9 rounded-xl bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        )}

      {/* Task Input */}
      <div className="mb-4">
        <input
          type="text"
          value={task.text}
          onChange={(e) =>
            onUpdateText(task.id, e.target.value)
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={task.completed}
          placeholder={`What's your task #${index + 1}?`}
          className={`w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 pb-2 ${
            task.completed
              ? "line-through opacity-60 cursor-not-allowed"
              : ""
          } ${isFocused ? "scale-[1.02]" : "scale-100"}`}
        />
        <div
          className={`h-0.5 w-full transition-all duration-300 ${
            isFocused
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 scale-x-100"
              : task.completed
                ? "bg-green-500 scale-x-100"
                : "bg-gray-200 dark:bg-gray-700 scale-x-0"
          }`}
        />
      </div>

      {/* Controls and Timer */}
      {task.text.trim() && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {!task.completed ? (
              <>
                {task.isTracking ? (
                  <Button
                    onClick={() => onPause(task.id)}
                    size="sm"
                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    onClick={() => onStart(task.id)}
                    size="sm"
                    className="rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {task.timeSpent > 0 ? "Resume" : "Start"}
                  </Button>
                )}

                <Button
                  onClick={() => onComplete(task.id)}
                  size="sm"
                  disabled={task.timeSpent === 0}
                  className="rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              </>
            ) : (
              <Button
                onClick={() => onUncomplete(task.id)}
                size="sm"
                className="rounded-xl bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Redo Task
              </Button>
            )}
          </div>

          {/* Timer Display */}
          {(task.timeSpent > 0 || task.isTracking) && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                task.isTracking
                  ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30 dark:from-indigo-500/40 dark:to-purple-600/40 animate-pulse"
                  : task.completed
                    ? "bg-green-500/30 dark:bg-green-500/40"
                    : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              <Timer
                className={`w-4 h-4 ${
                  task.isTracking
                    ? "text-indigo-600 dark:text-indigo-300"
                    : task.completed
                      ? "text-green-600 dark:text-green-300"
                      : "text-gray-600 dark:text-gray-400"
                }`}
              />
              <span
                className={`tabular-nums ${
                  task.isTracking
                    ? "text-indigo-900 dark:text-indigo-100"
                    : task.completed
                      ? "text-green-900 dark:text-green-100"
                      : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {formatTime(task.timeSpent)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Active Tracking Indicator */}
      {task.isTracking && (
        <div className="absolute inset-0 rounded-3xl border-2 border-indigo-500 dark:border-indigo-400 animate-pulse pointer-events-none" />
      )}

      {/* Completion Glow */}
      {task.completed && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-400/20 to-emerald-400/20 blur-xl pointer-events-none" />
      )}
    </div>
  );
}