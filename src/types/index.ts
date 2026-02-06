import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  image?: string;
  health: number;
  maxHealth: number;
  xp: number;
  level: number;
  streaks: number;
  fragments: number;
  isDead: boolean;
  deathDate?: Date;
  canRevive: boolean;
  friends: Types.ObjectId[];
  friendRequests: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubtask {
  _id: Types.ObjectId;
  text: string;
  completed: boolean;
}

export interface ITask {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description?: string;
  subtasks: ISubtask[];
  deadline?: Date;
  completed: boolean;
  visibility: 'private' | 'shared' | 'joint';
  sharedWith: Types.ObjectId[];
  assignedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoast {
  message: string;
  severity: 'mild' | 'medium' | 'savage';
}

export type TeddyState = 'neutral' | 'happy' | 'sad' | 'dead';

export interface GameStats {
  health: number;
  maxHealth: number;
  xp: number;
  level: number;
  streaks: number;
  fragments: number;
  xpToNextLevel: number;
}

export interface DashboardStats {
  totalTasks: number;
  completedToday: number;
  totalToday: number;
  completionRate: number;
}
