import { IUser } from '@/types';

// XP required for each level (exponential growth)
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Calculate current progress to next level
export function getXPProgress(xp: number, level: number): {
  current: number;
  required: number;
  percentage: number;
} {
  const required = getXPForLevel(level + 1);
  const currentLevelXP = getXPForLevel(level);
  const current = xp - currentLevelXP;
  const levelRange = required - currentLevelXP;
  const percentage = Math.min(100, Math.floor((current / levelRange) * 100));

  return {
    current: Math.max(0, current),
    required: levelRange,
    percentage: Math.max(0, percentage),
  };
}

// Check if user should level up and return new level
export function checkLevelUp(xp: number, currentLevel: number): {
  shouldLevelUp: boolean;
  newLevel: number;
  healthBonus: number;
} {
  let newLevel = currentLevel;
  let shouldLevelUp = false;

  while (xp >= getXPForLevel(newLevel + 1)) {
    newLevel++;
    shouldLevelUp = true;
  }

  // Health bonus: +2 max HP every 5 levels
  const healthBonus = Math.floor(newLevel / 5) * 2;

  return { shouldLevelUp, newLevel, healthBonus };
}

// Calculate max health based on level
export function getMaxHealthForLevel(level: number): number {
  const baseHealth = 10;
  const healthBonus = Math.floor(level / 5) * 2;
  return baseHealth + healthBonus;
}

// XP rewards
export const XP_REWARDS = {
  TASK_CREATE: 5,
  TASK_COMPLETE: 10,
  SUBTASK_COMPLETE: 2,
  DAILY_100_PERCENT: 20,
  DAILY_STREAK: 15,
  HELP_FRIEND: 5,
  LEVEL_UP: 50,
};

// Health costs
export const HEALTH_COSTS = {
  MISSED_DEADLINE: -1,
  TASK_COMPLETE_BONUS: 1, // Only if under max health
};

// Streak and fragment logic
export function calculateDailyReward(completionRate: number): {
  streakEarned: boolean;
  fragmentsEarned: number;
  xpBonus: number;
} {
  if (completionRate >= 100) {
    return {
      streakEarned: true,
      fragmentsEarned: 0,
      xpBonus: XP_REWARDS.DAILY_100_PERCENT,
    };
  } else if (completionRate >= 80) {
    return {
      streakEarned: false,
      fragmentsEarned: 1,
      xpBonus: 0,
    };
  } else {
    return {
      streakEarned: false,
      fragmentsEarned: 0,
      xpBonus: 0,
    };
  }
}

// Revival cost calculation
export function getRevivalCost(level: number): number {
  // Base cost: 3 streaks
  // Increases by 1 streak every 10 levels
  return 3 + Math.floor(level / 10);
}

// Check if user can revive
export function canUserRevive(streaks: number, level: number): boolean {
  const cost = getRevivalCost(level);
  return streaks >= cost;
}

// Death check
export function checkIfDead(health: number): boolean {
  return health <= 0;
}

// Calculate lockout end date (3 days from death)
export function getLockoutEndDate(deathDate: Date): Date {
  const lockoutEnd = new Date(deathDate);
  lockoutEnd.setDate(lockoutEnd.getDate() + 3);
  return lockoutEnd;
}

// Check if lockout period is over
export function isLockoutOver(deathDate: Date | undefined): boolean {
  if (!deathDate) return true;
  const lockoutEnd = getLockoutEndDate(deathDate);
  return new Date() >= lockoutEnd;
}
