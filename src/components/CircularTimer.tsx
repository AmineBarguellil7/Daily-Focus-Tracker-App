import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

export function CircularTimer() {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [initialTime] = useState(25 * 60);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = window.setInterval(() => {
        setTime(t => t - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, time]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(initialTime);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const progress = ((initialTime - time) / initialTime) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
      <h2 className="text-gray-900 dark:text-white mb-6 text-center">Focus Timer</h2>
      
      <div className="flex justify-center mb-8">
        <div className="relative w-64 h-64">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              className="fill-none stroke-gray-200 dark:stroke-gray-700"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              className="fill-none stroke-purple-500 dark:stroke-purple-400 transition-all duration-1000 ease-linear"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Timer display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-gray-900 dark:text-white tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {isActive ? 'Focus Mode' : 'Ready to focus'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={toggleTimer}
          size="lg"
          className="rounded-full bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-8"
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start
            </>
          )}
        </Button>
        <Button
          onClick={resetTimer}
          size="lg"
          variant="outline"
          className="rounded-full bg-white/80 dark:bg-gray-700/80"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
