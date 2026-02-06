import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '@/types';

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    health: {
      type: Number,
      default: 10,
    },
    maxHealth: {
      type: Number,
      default: 10,
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    streaks: {
      type: Number,
      default: 0,
    },
    fragments: {
      type: Number,
      default: 0,
    },
    isDead: {
      type: Boolean,
      default: false,
    },
    deathDate: {
      type: Date,
    },
    canRevive: {
      type: Boolean,
      default: false,
    },
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    friendRequests: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
