'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, Users, Bot } from 'lucide-react';
import HealthBar from '@/components/game/HealthBar';
import XPBar from '@/components/game/XPBar';
import StreakCounter from '@/components/game/StreakCounter';
import TeddyMascot from '@/components/game/TeddyMascot';
import TaskCard from '@/components/ui/TaskCard';
import CreateTaskModal from '@/components/ui/CreateTaskModal';
import DeathScreen from '@/components/ui/DeathScreen';
import { ITask } from '@/types';
import { getRandomRoast } from '@/lib/roasts';

export default function Dashboard() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState<ITask[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [xpProgress, setXpProgress] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeathScreen, setShowDeathScreen] = useState(false);
  const [roastMessage, setRoastMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Use useCallback to prevent infinite loops
  const fetchData = useCallback(async () => {
    try {
      // Fetch tasks
      const tasksRes = await fetch('/api/tasks');
      if (!tasksRes.ok) {
        console.error('Failed to fetch tasks:', tasksRes.status);
        setTasks([]);
      } else {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }

      // Fetch stats
      const statsRes = await fetch('/api/stats');
      if (!statsRes.ok) {
        console.error('Failed to fetch stats:', statsRes.status);
        // Set default stats if fetch fails
        setStats({
          totalTasks: 0,
          completedToday: 0,
          totalToday: 0,
          completionRate: 0,
        });
        setXpProgress({
          current: 0,
          required: 100,
          percentage: 0,
        });
      } else {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setXpProgress(statsData.xpProgress);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set defaults on error
      setTasks([]);
      setStats({
        totalTasks: 0,
        completedToday: 0,
        totalToday: 0,
        completionRate: 0,
      });
      setXpProgress({
        current: 0,
        required: 100,
        percentage: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array - function doesn't depend on anything

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, fetchData]);

  useEffect(() => {
    if (session?.user?.isDead && !showDeathScreen) {
      setRoastMessage(getRandomRoast());
      setShowDeathScreen(true);
    }
  }, [session?.user?.isDead, showDeathScreen]);

  const handleCreateTask = async (taskData: any) => {
    try {
      console.log('Creating task with data:', taskData);
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to create task:', error);
        alert(`Failed to create task: ${error.error || 'Unknown error'}`);
        return;
      }
    const result = await res.json();
    console.log('Task created successfully:', result);

    // Optimistically update UI
    setTasks(prevTasks => [result.task, ...prevTasks]);
      // Success - refresh data
       fetchData();
       update(); // Refresh session to get updated XP
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      });

      if (!res.ok) {
        console.error('Failed to complete task');
        return;
      }

      await fetchData();
      await update(); // Refresh session
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        console.error('Failed to delete task');
        return;
      }

      await fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSubtaskToggle = async (taskId: string, subtaskId: string) => {
    try {
      const task = tasks.find(t => t._id.toString() === taskId);
      if (!task) return;

      const updatedSubtasks = task.subtasks.map(st => 
        st._id.toString() === subtaskId 
          ? { ...st, completed: !st.completed }
          : st
      );

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtasks: updatedSubtasks }),
      });

      if (!res.ok) {
        console.error('Failed to toggle subtask');
        return;
      }

      await fetchData();
    } catch (error) {
      console.error('Error toggling subtask:', error);
    }
  };

  const handleRevive = async (useStreaks: boolean) => {
    try {
      const res = await fetch('/api/revive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useStreaks }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowDeathScreen(false);
        await update(); // Refresh session
        await fetchData();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error reviving:', error);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-cream text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <header className="border-b-brutal border-black bg-purple py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-cream" />
              <h1 className="text-2xl font-black text-cream">Do-It-Inator</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-cream">
                <img 
                  src={session.user.image || ''} 
                  alt={session.user.name} 
                  className="w-8 h-8 rounded-full border-2 border-cream"
                />
                <span className="font-bold">{session.user.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn-brutal-secondary py-2 px-4 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Stats */}
          <div className="space-y-6">
            {/* Mascot */}
            <div className="card-brutal bg-cream flex justify-center">
              <TeddyMascot 
                state={
                  session.user.health === 0 ? 'dead' :
                  session.user.health <= 3 ? 'sad' :
                  session.user.health === session.user.maxHealth ? 'happy' :
                  'neutral'
                } 
              />
            </div>

            {/* Health */}
            <div className="card-brutal bg-cream">
              <HealthBar 
                current={session.user.health || 10} 
                max={session.user.maxHealth || 10} 
              />
            </div>

            {/* XP */}
            <div className="card-brutal bg-cream">
              {xpProgress ? (
                <XPBar 
                  current={xpProgress.current}
                  required={xpProgress.required}
                  level={session.user.level || 1}
                  percentage={xpProgress.percentage}
                />
              ) : (
                <div className="text-center py-4 text-gray-500">Loading XP...</div>
              )}
            </div>

            {/* Streaks */}
            <StreakCounter 
              streaks={session.user.streaks || 0}
              fragments={session.user.fragments || 0}
            />

            {/* Daily Progress */}
            {stats ? (
              <div className="card-brutal bg-skyblue">
                <h3 className="font-bold mb-3">Today's Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-bold">{stats.completedToday} / {stats.totalToday}</span>
                  </div>
                  <div className="w-full h-4 bg-white border-2 border-black">
                    <div 
                      className="h-full bg-purple transition-all"
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                  <div className="text-sm text-center font-bold">
                    {stats.completionRate}% Complete
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-brutal bg-skyblue">
                <div className="text-center py-4 text-gray-500">Loading stats...</div>
              </div>
            )}
          </div>

          {/* Main Content - Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-cream">Your Tasks</h2>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-brutal flex items-center gap-2"
                disabled={session.user.isDead}
              >
                <Plus className="w-5 h-5" />
                New Task
              </button>
            </div>

            {/* Active Tasks */}
            {activeTasks.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-skyblue">Active</h3>
                {activeTasks.map(task => (
                  <TaskCard
                    key={task._id.toString()}
                    task={task}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                    onSubtaskToggle={handleSubtaskToggle}
                  />
                ))}
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-400">Completed</h3>
                {completedTasks.map(task => (
                  <TaskCard
                    key={task._id.toString()}
                    task={task}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                    onSubtaskToggle={handleSubtaskToggle}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {tasks.length === 0 && !isLoading && (
              <div className="card-brutal bg-cream text-center py-12">
                <h3 className="text-2xl font-black mb-4">No tasks yet!</h3>
                <p className="text-gray-600 mb-6">Create your first task to get started.</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-brutal"
                  disabled={session.user.isDead}
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Create Task
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTask}
      />

      {session.user.isDead && session.user.deathDate && (
        <DeathScreen
          isOpen={showDeathScreen}
          roastMessage={roastMessage}
          streaks={session.user.streaks || 0}
          level={session.user.level || 1}
          deathDate={new Date(session.user.deathDate)}
          onRevive={handleRevive}
        />
      )}
    </div>
  );
}