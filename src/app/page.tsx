'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Bot, Skull, Trophy, Zap } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-cream text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-navy">
      {/* Header */}
      <header className="border-b-brutal border-black bg-purple py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Bot className="w-10 h-10 text-cream" />
            <h1 className="text-3xl font-black text-cream">Do-It-Inator</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Mascot Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 bg-cream border-brutal border-black shadow-brutal flex items-center justify-center">
              <Bot className="w-24 h-24 text-navy" strokeWidth={3} />
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-6xl font-black text-cream mb-6">
            Turning Procrastination
            <br />
            Into Extinction
          </h2>

          {/* Subheadline */}
          <p className="text-2xl text-cream mb-12 font-bold">
            Miss your deadlines? Lose health. Hit zero? You die. Simple.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="btn-brutal text-xl px-12 py-6 inline-block"
          >
            Sign in with Google
          </button>

          {/* Feature Pills */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-brutal bg-cream">
              <Zap className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Real Consequences</h3>
              <p className="text-sm">Miss deadlines, lose health points, face extinction</p>
            </div>

            <div className="card-brutal bg-cream">
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Level Up</h3>
              <p className="text-sm">Earn XP, build streaks, unlock more max health</p>
            </div>

            <div className="card-brutal bg-cream">
              <Skull className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Death & Revival</h3>
              <p className="text-sm">Die? Get roasted. Wait 3 days or spend streaks to revive</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-purple py-20 border-t-brutal border-b-brutal border-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-cream text-center mb-12">
            How It Works
          </h2>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="card-brutal bg-cream">
              <div className="flex items-start gap-4">
                <div className="text-3xl font-black text-purple">1</div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Create Tasks</h3>
                  <p>Set deadlines, add subtasks, share with friends. Every task matters.</p>
                </div>
              </div>
            </div>

            <div className="card-brutal bg-cream">
              <div className="flex items-start gap-4">
                <div className="text-3xl font-black text-purple">2</div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Complete or Die</h3>
                  <p>Finish tasks to gain XP and health. Miss deadlines? Lose 1 HP each time.</p>
                </div>
              </div>
            </div>

            <div className="card-brutal bg-cream">
              <div className="flex items-start gap-4">
                <div className="text-3xl font-black text-purple">3</div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Build Streaks</h3>
                  <p>Complete 100% of daily tasks to earn streaks. Use them for revival.</p>
                </div>
              </div>
            </div>

            <div className="card-brutal bg-cream">
              <div className="flex items-start gap-4">
                <div className="text-3xl font-black text-purple">4</div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Face the Consequences</h3>
                  <p>Hit 0 HP? Face public roasting. Wait 3 days or burn streaks to revive.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-cream">
        <p className="font-bold">© 2026 Do-It-Inator. Get it done or get extinct.</p>
      </footer>
    </main>
  );
}
