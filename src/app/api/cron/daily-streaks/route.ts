import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/lib/models/Task';
import User from '@/lib/models/User';
import { calculateDailyReward, XP_REWARDS } from '@/lib/gamification';

// This endpoint should be called once per day at midnight
// to calculate daily streaks and fragments
export async function GET(req: Request) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get yesterday's date range
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    // Get all active users (not dead)
    const users = await User.find({ isDead: false });

    const results = [];

    for (const user of users) {
      // Get yesterday's tasks for this user
      const yesterdayTasks = await Task.find({
        userId: user._id,
        createdAt: { $gte: yesterday, $lte: endOfYesterday },
      });

      if (yesterdayTasks.length === 0) {
        // No tasks created yesterday - reset streak
        if (user.streaks > 0 || user.fragments > 0) {
          user.streaks = 0;
          user.fragments = 0;
          await user.save();
          
          results.push({
            userId: user._id,
            action: 'reset',
            reason: 'No tasks created',
          });
        }
        continue;
      }

      // Calculate completion rate
      const completedCount = yesterdayTasks.filter(t => t.completed).length;
      const completionRate = (completedCount / yesterdayTasks.length) * 100;

      // Calculate rewards
      const reward = calculateDailyReward(completionRate);

      if (reward.streakEarned) {
        user.streaks += 1;
        user.xp += reward.xpBonus;
        
        // Convert 5 fragments to 1 streak
        if (user.fragments >= 5) {
          const bonusStreaks = Math.floor(user.fragments / 5);
          user.streaks += bonusStreaks;
          user.fragments = user.fragments % 5;
        }

        await user.save();

        results.push({
          userId: user._id,
          action: 'streak',
          completionRate,
          xpGained: reward.xpBonus,
        });
      } else if (reward.fragmentsEarned > 0) {
        user.fragments += reward.fragmentsEarned;
        
        // Convert 5 fragments to 1 streak
        if (user.fragments >= 5) {
          const bonusStreaks = Math.floor(user.fragments / 5);
          user.streaks += bonusStreaks;
          user.fragments = user.fragments % 5;
        }

        await user.save();

        results.push({
          userId: user._id,
          action: 'fragment',
          completionRate,
          fragmentsGained: reward.fragmentsEarned,
        });
      } else {
        // Under 80% completion - reset streak
        user.streaks = 0;
        user.fragments = 0;
        await user.save();

        results.push({
          userId: user._id,
          action: 'reset',
          completionRate,
          reason: 'Low completion rate',
        });
      }
    }

    return NextResponse.json({
      message: 'Daily streak calculation completed',
      affectedUsers: results.length,
      results,
    });
  } catch (error) {
    console.error('Error in daily streak cron job:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
