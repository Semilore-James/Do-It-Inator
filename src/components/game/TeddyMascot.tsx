'use client';

import { Bot, Smile, Frown, Skull, Trophy } from 'lucide-react';
import { TeddyState } from '@/types';

interface TeddyMascotProps {
  state: TeddyState;
  size?: 'sm' | 'md' | 'lg';
}

export default function TeddyMascot({ state, size = 'md' }: TeddyMascotProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const getIcon = () => {
    switch (state) {
      case 'neutral':
        return <Bot className={iconSizes[size]} strokeWidth={3} />;
      case 'happy':
        return <Smile className={iconSizes[size]} strokeWidth={3} />;
      case 'sad':
        return <Frown className={iconSizes[size]} strokeWidth={3} />;
      case 'dead':
        return <Skull className={iconSizes[size]} strokeWidth={3} />;
      default:
        return <Bot className={iconSizes[size]} strokeWidth={3} />;
    }
  };

  const getColors = () => {
    switch (state) {
      case 'neutral':
        return 'bg-cream text-navy';
      case 'happy':
        return 'bg-skyblue text-navy animate-bounce';
      case 'sad':
        return 'bg-purple text-white animate-pulse';
      case 'dead':
        return 'bg-gray-800 text-gray-400';
      default:
        return 'bg-cream text-navy';
    }
  };

  return (
    <div className={`${sizeClasses[size]} ${getColors()} border-brutal border-black shadow-brutal flex items-center justify-center transition-all`}>
      {getIcon()}
    </div>
  );
}
