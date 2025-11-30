import { Sparkles } from "lucide-react";

const quotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
  },
  {
    text: "It's not about having time. It's about making time.",
    author: "Unknown",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
];

export function QuoteOfTheDay() {
  // Get a consistent quote for the day based on the date
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() -
      new Date(today.getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  const quote = quotes[dayOfYear % quotes.length];

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-700/50">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400" />
        <h3 className="text-purple-900 dark:text-purple-300">
          Quote of the Day
        </h3>
      </div>
      <blockquote className="text-gray-700 dark:text-gray-300 italic mb-2">
        "{quote.text}"
      </blockquote>
      <p className="text-gray-600 dark:text-gray-400">
        — {quote.author}
      </p>
    </div>
  );
}