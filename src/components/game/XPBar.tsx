'use client';

import { Zap } from 'lucide-react';

interface XPBarProps {
  current: number;
  required: number;
  level: number;
  percentage: number;
}

export default function XPBar({ current, required, level, percentage }: XPBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple" fill="currentColor" />
          <span className="font-bold text-sm">Level {level}</span>
        </div>
        <span className="text-sm font-bold text-purple">
          {current} / {required} XP
        </span>
      </div>
      
      <div className="xp-bar">
        <div 
          className="xp-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
