import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

// PATCH accept friend request
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ← Changed to Promise
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: friendId } = await params; // ← Await params and destructure

    await dbConnect();

    const currentUser = await User.findById(session.user.id);

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if friend request exists
    if (!currentUser.friendRequests.includes(friendId as any)) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 });
    }

    // Add to friends list for both users
    await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { friends: friendId },
      $pull: { friendRequests: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $addToSet: { friends: session.user.id },
    });

    return NextResponse.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return NextResponse.json({ error: 'Failed to accept friend request' }, { status: 500 });
  }
}

// DELETE reject/remove friend
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ← Changed to Promise
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: friendId } = await params; // ← Await params and destructure

    await dbConnect();

    // Remove from friend requests or friends list
    await User.findByIdAndUpdate(session.user.id, {
      $pull: { 
        friendRequests: friendId,
        friends: friendId,
      },
    });

    // If they were friends, remove from other user's friends list too
    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: session.user.id },
    });

    return NextResponse.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    return NextResponse.json({ error: 'Failed to remove friend' }, { status: 500 });
  }
}