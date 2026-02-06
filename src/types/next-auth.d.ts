import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      health: number;
      maxHealth: number;
      xp: number;
      level: number;
      streaks: number;
      fragments: number;
      isDead: boolean;
      deathDate?: Date;
    };
  }
}

declare module 'mongoose' {
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  };
}
