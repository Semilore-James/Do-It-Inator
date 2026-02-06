import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Task from '@/lib/models/Task';
import User from '@/lib/models/User';
import { updateTaskSchema } from '@/lib/validation';
import { XP_REWARDS, HEALTH_COSTS, checkLevelUp, getMaxHealthForLevel } from '@/lib/gamification';

// GET single task
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const task = await Task.findById(params.id)
      .populate('userId', 'name email image')
      .populate('assignedBy', 'name email image');

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check if user has access to this task
    const hasAccess = 
      task.userId._id.toString() === session.user.id ||
      task.sharedWith.some((id: any) => id.toString() === session.user.id);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// PATCH update task
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate input
    const result = updateTaskSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error },
        { status: 400 }
      );
    }

    await dbConnect();

    const task = await Task.findById(params.id);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check if user owns the task or has joint access
    const canEdit = 
      task.userId.toString() === session.user.id ||
      (task.visibility === 'joint' && task.sharedWith.some((id: any) => id.toString() === session.user.id));

    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if task is being marked as complete
    const wasCompleted = task.completed;
    const isNowCompleted = result.data.completed === true;
    
    let xpGained = 0;
    let healthGained = 0;
    let leveledUp = false;
    let newLevel = session.user.level;

    if (!wasCompleted && isNowCompleted) {
      // Award XP for completing task
      xpGained = XP_REWARDS.TASK_COMPLETE;
      
      // Award XP for each subtask
      const subtaskXP = (task.subtasks?.length || 0) * XP_REWARDS.SUBTASK_COMPLETE;
      xpGained += subtaskXP;

      // Get current user data
      const user = await User.findById(session.user.id);
      
      if (user) {
        // Update XP
        user.xp += xpGained;

        // Check for level up
        const levelUpResult = checkLevelUp(user.xp, user.level);
        if (levelUpResult.shouldLevelUp) {
          user.level = levelUpResult.newLevel;
          user.maxHealth = getMaxHealthForLevel(levelUpResult.newLevel);
          xpGained += XP_REWARDS.LEVEL_UP;
          leveledUp = true;
          newLevel = levelUpResult.newLevel;
        }

        // Award health if under max
        if (user.health < user.maxHealth) {
          user.health = Math.min(user.maxHealth, user.health + HEALTH_COSTS.TASK_COMPLETE_BONUS);
          healthGained = 1;
        }

        await user.save();
      }
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      params.id,
      {
        ...result.data,
        deadline: result.data.deadline ? new Date(result.data.deadline) : task.deadline,
      },
      { new: true }
    )
      .populate('userId', 'name email image')
      .populate('assignedBy', 'name email image');

    return NextResponse.json({ 
      task: updatedTask,
      xpGained,
      healthGained,
      leveledUp,
      newLevel,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE task
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const task = await Task.findById(params.id);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Only task owner can delete
    if (task.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Task.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
