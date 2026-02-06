'use client';

import { Heart } from 'lucide-react';

interface HealthBarProps {
  current: number;
  max: number;
}

export default function HealthBar({ current, max }: HealthBarProps) {
  const segments = Array.from({ length: max }, (_, i) => i < current);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
        <span className="font-bold text-sm">
          {current} / {max} HP
        </span>
      </div>
      
      <div className="flex gap-1 flex-wrap">
        {segments.map((isFilled, index) => (
          <div
            key={index}
            className={`health-segment ${!isFilled ? 'lost' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
