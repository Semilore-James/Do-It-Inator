import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Task from '@/lib/models/Task';
import User from '@/lib/models/User';
import { getXPProgress } from '@/lib/gamification';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get user data
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get today's tasks
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayTasks = await Task.find({
      userId: session.user.id,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const completedToday = todayTasks.filter(t => t.completed).length;
    const totalToday = todayTasks.length;
    const completionRate = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

    // Get XP progress
    const xpProgress = getXPProgress(user.xp, user.level);

    // Get all tasks count
    const allTasks = await Task.countDocuments({ userId: session.user.id });

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
        health: user.health,
        maxHealth: user.maxHealth,
        xp: user.xp,
        level: user.level,
        streaks: user.streaks,
        fragments: user.fragments,
        isDead: user.isDead,
        deathDate: user.deathDate,
        canRevive: user.canRevive,
      },
      stats: {
        totalTasks: allTasks,
        completedToday,
        totalToday,
        completionRate: Math.round(completionRate),
      },
      xpProgress,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
