import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/lib/models/Task';
import User from '@/lib/models/User';
import { HEALTH_COSTS, checkIfDead } from '@/lib/gamification';

// This endpoint should be called by a cron job service (like Vercel Cron or external service)
// Call every hour to check for missed deadlines
export async function GET(req: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();

    // Find all tasks with deadlines that have passed and are not completed
    const missedTasks = await Task.find({
      deadline: { $lt: now },
      completed: false,
    });

    const affectedUsers = new Map<string, number>(); // userId -> health loss count

    for (const task of missedTasks) {
      const userId = task.userId.toString();
      const currentLoss = affectedUsers.get(userId) || 0;
      affectedUsers.set(userId, currentLoss + 1);

      // Mark task as completed to prevent repeated penalties
      task.completed = true;
      await task.save();
    }

    const results = [];

    // Apply health penalties to affected users
    for (const [userId, lossCount] of affectedUsers) {
      const user = await User.findById(userId);
      
      if (!user) continue;

      // Skip if already dead
      if (user.isDead) continue;

      // Apply health penalty
      const healthLoss = HEALTH_COSTS.MISSED_DEADLINE * lossCount;
      user.health = Math.max(0, user.health + healthLoss);

      // Check if user died
      if (checkIfDead(user.health)) {
        user.isDead = true;
        user.deathDate = new Date();
        user.canRevive = true;
      }

      await user.save();

      results.push({
        userId,
        missedTasks: lossCount,
        healthLoss,
        isDead: user.isDead,
      });
    }

    return NextResponse.json({
      message: 'Deadline check completed',
      affectedUsers: results.length,
      results,
    });
  } catch (error) {
    console.error('Error in deadline cron job:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
