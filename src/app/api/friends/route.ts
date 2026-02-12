import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { friendRequestSchema } from '@/lib/validation';

// GET all friends and friend requests
export async function GET(req: Request) {
  try {
    const session = await auth;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id)
      .populate('friends', 'name email image level')
      .populate('friendRequests', 'name email image level');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      friends: user.friends,
      friendRequests: user.friendRequests,
    });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 });
  }
}

// POST send friend request
export async function POST(req: Request) {
  try {
    const session = await auth;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate input
    const result = friendRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find current user first (fix for TypeScript error)
    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find friend by email
    const friend = await User.findOne({ email: result.data.friendEmail });
    if (!friend) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Can't add yourself
    if (friend._id.toString() === session.user.id) {
      return NextResponse.json({ error: 'Cannot add yourself as friend' }, { status: 400 });
    }

    // Check if already friends
    if (currentUser.friends.includes(friend._id)) {
      return NextResponse.json({ error: 'Already friends' }, { status: 400 });
    }

    // Check if request already sent
    if (friend.friendRequests.includes(currentUser._id)) {
      return NextResponse.json({ error: 'Friend request already sent' }, { status: 400 });
    }

    // Add friend request
    await User.findByIdAndUpdate(friend._id, {
      $addToSet: { friendRequests: currentUser._id },
    });

    return NextResponse.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json({ error: 'Failed to send friend request' }, { status: 500 });
  }
}