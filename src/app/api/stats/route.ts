import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Task from '@/lib/models/Task';
import User from '@/lib/models/User';
import { getXPProgress } from '@/lib/gamification';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('📊 Stats - Session user:', session?.user);
    console.log('📊 Stats - User ID:', session?.user?.id);
    console.log('📊 Stats - User email:', session?.user?.email);
    
    if (!session?.user?.email) {
      console.log('❌ No session email');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // IMPORTANT: Use ID if available, otherwise fall back to email lookup
    let user;
    if (session.user.id) {
      console.log('✅ Using session.user.id:', session.user.id);
      user = await User.findById(session.user.id);
    } else {
      console.log('⚠️ No session.user.id, falling back to email lookup');
      user = await User.findOne({ email: session.user.email });
    }
    
    if (!user) {
      console.error('❌ User not found for email:', session.user.email);
      return NextResponse.json({
        user: {
          id: null,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          health: 10,
          maxHealth: 10,
          xp: 0,
          level: 1,
          streaks: 0,
          fragments: 0,
          isDead: false,
          deathDate: null,
          canRevive: false,
        },
        stats: {
          totalTasks: 0,
          completedToday: 0,
          totalToday: 0,
          completionRate: 0,
        },
        xpProgress: {
          current: 0,
          required: 100,
          percentage: 0,
        },
      });
    }

    console.log('✅ User found:', user._id);

    // Get today's tasks
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayTasks = await Task.find({
      userId: user._id,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const completedToday = todayTasks.filter(t => t.completed).length;
    const totalToday = todayTasks.length;
    const completionRate = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

    const xpProgress = getXPProgress(user.xp, user.level);
    const allTasks = await Task.countDocuments({ userId: user._id });

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
    console.error('❌ Error fetching stats:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch stats',
      details: error instanceof Error ? error.message : 'Unknown'
    }, { status: 500 });
  }
}