import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Task from '@/lib/models/Task';
import User from '@/lib/models/User';
import { createTaskSchema } from '@/lib/validation';
import { XP_REWARDS } from '@/lib/gamification';

export async function GET(req: Request) {
  try {
    console.log('🔵 GET /api/tasks');
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log('❌ No session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const tasks = await Task.find({
      $or: [
        { userId: user._id },
        { sharedWith: user._id },
      ],
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email image')
      .populate('assignedBy', 'name email image');

    console.log('✅ Tasks found:', tasks.length);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('❌ GET Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch tasks',
      details: error instanceof Error ? error.message : 'Unknown'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    console.log('🔵 POST /api/tasks');
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log('❌ No session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('📦 Body:', body);
    
    const result = createTaskSchema.safeParse(body);
    if (!result.success) {
      console.log('❌ Validation failed:', result.error);
      return NextResponse.json(
        { error: 'Invalid input', details: result.error },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const task = await Task.create({
      userId: user._id,
      title: result.data.title,
      description: result.data.description || '',
      subtasks: result.data.subtasks || [],
      deadline: result.data.deadline && result.data.deadline.trim() !== '' 
    ? new Date(result.data.deadline) 
    : undefined, 
      visibility: result.data.visibility || 'private',
      sharedWith: result.data.sharedWith || [],
    });

    await User.findByIdAndUpdate(user._id, {
      $inc: { xp: XP_REWARDS.TASK_CREATE },
    });

    console.log('✅ Task created:', task._id);
    return NextResponse.json({ 
      task,
      xpGained: XP_REWARDS.TASK_CREATE,
    }, { status: 201 });
  } catch (error) {
    console.error('❌ POST Error:', error);
    return NextResponse.json({ 
      error: 'Failed to create task',
      details: error instanceof Error ? error.message : 'Unknown'
    }, { status: 500 });
  }
}