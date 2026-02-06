'use client';

import { Flame, Sparkles } from 'lucide-react';

interface StreakCounterProps {
  streaks: number;
  fragments: number;
}

export default function StreakCounter({ streaks, fragments }: StreakCounterProps) {
  return (
    <div className="flex gap-4">
      {/* Streaks */}
      <div className="card-brutal bg-purple text-white px-4 py-2 flex items-center gap-2">
        <Flame className="w-5 h-5" fill="currentColor" />
        <div>
          <div className="text-xs font-bold opacity-80">STREAKS</div>
          <div className="text-2xl font-black">{streaks}</div>
        </div>
      </div>

      {/* Fragments */}
      <div className="card-brutal bg-skyblue px-4 py-2 flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        <div>
          <div className="text-xs font-bold opacity-80">FRAGMENTS</div>
          <div className="text-2xl font-black">{fragments}/5</div>
        </div>
      </div>
    </div>
  );
}
