// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect();

      // Check if user exists, if not create new user
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          email: user.email,
          name: user.name,
          image: user.image,
          health: 10,
          maxHealth: 10,
          xp: 0,
          level: 1,
          streaks: 0,
          fragments: 0,
          isDead: false,
          friends: [],
          friendRequests: [],
        });
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        await dbConnect();
        const dbUser = await User.findOne({ email: session.user.email });
        
        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.health = dbUser.health;
          session.user.maxHealth = dbUser.maxHealth;
          session.user.xp = dbUser.xp;
          session.user.level = dbUser.level;
          session.user.streaks = dbUser.streaks;
          session.user.fragments = dbUser.fragments;
          session.user.isDead = dbUser.isDead;
          session.user.deathDate = dbUser.deathDate;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};