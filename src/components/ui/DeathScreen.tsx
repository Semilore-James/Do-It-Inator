'use client';

import { useState } from 'react';
import { Skull, Flame } from 'lucide-react';
import TeddyMascot from '../game/TeddyMascot';
import { getRevivalCost, getLockoutEndDate } from '@/lib/gamification';
import { format } from 'date-fns';

interface DeathScreenProps {
  isOpen: boolean;
  roastMessage: string;
  streaks: number;
  level: number;
  deathDate: Date;
  onRevive: (useStreaks: boolean) => void;
}

export default function DeathScreen({
  isOpen,
  roastMessage,
  streaks,
  level,
  deathDate,
  onRevive,
}: DeathScreenProps) {
  const [isReviving, setIsReviving] = useState(false);

  if (!isOpen) return null;

  const revivalCost = getRevivalCost(level);
  const canReviveWithStreaks = streaks >= revivalCost;
  const lockoutEnd = getLockoutEndDate(deathDate);

  const handleRevive = async (useStreaks: boolean) => {
    setIsReviving(true);
    await onRevive(useStreaks);
    setIsReviving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div 
        className="card-brutal bg-cream max-w-2xl w-full transform -rotate-3 animate-bounce"
        style={{ animationIterationCount: 1, animationDuration: '0.5s' }}
      >
        {/* Skull Icon */}
        <div className="flex justify-center mb-6">
          <TeddyMascot state="dead" size="lg" />
        </div>

        {/* Death Message */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-red-600 mb-4 text-shadow-brutal">
            YOU'VE FAILED
          </h1>
          <div className="card-brutal bg-navy text-white p-6">
            <p className="text-xl font-bold italic">"{roastMessage}"</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-purple text-white p-4 border-brutal border-black mb-6">
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-sm opacity-80">Current Streaks</div>
              <div className="text-3xl font-black">{streaks}</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-80">Revival Cost</div>
              <div className="text-3xl font-black">{revivalCost}</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-80">Current Level</div>
              <div className="text-3xl font-black">{level}</div>
            </div>
          </div>
        </div>

        {/* Revival Options */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-center mb-4">Choose Your Fate</h2>

          {/* Option 1: Streak Revival */}
          <button
            onClick={() => handleRevive(true)}
            disabled={!canReviveWithStreaks || isReviving}
            className={`w-full p-6 border-brutal border-black ${
              canReviveWithStreaks
                ? 'bg-purple text-white shadow-brutal hover:shadow-brutal-hover cursor-pointer'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="text-xl font-black mb-1">💰 Spend {revivalCost} Streaks</div>
                <div className="text-sm opacity-80">
                  {canReviveWithStreaks 
                    ? 'Revive immediately with half health' 
                    : `Need ${revivalCost - streaks} more streaks`}
                </div>
              </div>
              <Flame className="w-8 h-8" />
            </div>
          </button>

          {/* Option 2: Wait for Lockout */}
          <div className="card-brutal bg-skyblue p-6">
            <div className="text-center">
              <div className="text-xl font-black mb-2">⏰ Wait for Lockout to End</div>
              <div className="text-sm mb-3">
                Lockout ends: <strong>{format(lockoutEnd, 'MMM d, yyyy h:mm a')}</strong>
              </div>
              <div className="text-sm opacity-80">
                Can't access app until then. Revive with full health.
              </div>
            </div>
          </div>
        </div>

        {/* Wisdom */}
        <div className="mt-8 p-4 bg-navy text-cream text-center border-brutal border-black">
          <p className="text-sm italic">
            "The only way to avoid death is to actually do your tasks. Revolutionary concept, we know."
          </p>
        </div>
      </div>
    </div>
  );
}
