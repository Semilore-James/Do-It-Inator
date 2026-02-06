import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { getRevivalCost, isLockoutOver, getMaxHealthForLevel } from '@/lib/gamification';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { useStreaks } = body;

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is actually dead
    if (!user.isDead) {
      return NextResponse.json({ error: 'User is not dead' }, { status: 400 });
    }

    // Check revival method
    if (useStreaks) {
      // Revive using streaks
      const cost = getRevivalCost(user.level);
      
      if (user.streaks < cost) {
        return NextResponse.json({ 
          error: `Not enough streaks. Need ${cost}, have ${user.streaks}` 
        }, { status: 400 });
      }

      // Deduct streaks and revive
      user.streaks -= cost;
      user.isDead = false;
      user.deathDate = undefined;
      user.health = Math.floor(user.maxHealth / 2); // Revive with half health
      user.canRevive = false;

      await user.save();

      return NextResponse.json({ 
        message: 'Revived successfully using streaks',
        streaksSpent: cost,
        newHealth: user.health,
      });
    } else {
      // Revive after lockout period
      if (!user.deathDate) {
        return NextResponse.json({ error: 'Invalid death date' }, { status: 400 });
      }

      if (!isLockoutOver(user.deathDate)) {
        return NextResponse.json({ 
          error: 'Lockout period not over yet',
          lockoutEndsAt: new Date(user.deathDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        }, { status: 400 });
      }

      // Revive after lockout
      user.isDead = false;
      user.deathDate = undefined;
      user.health = user.maxHealth; // Revive with full health after waiting
      user.canRevive = false;

      await user.save();

      return NextResponse.json({ 
        message: 'Revived successfully after lockout period',
        newHealth: user.health,
      });
    }
  } catch (error) {
    console.error('Error reviving user:', error);
    return NextResponse.json({ error: 'Failed to revive user' }, { status: 500 });
  }
}
