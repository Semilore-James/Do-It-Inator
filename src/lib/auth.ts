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
      try {
        console.log('🔵 SignIn callback started for:', user.email);
        
        await dbConnect();
        console.log('✅ MongoDB connected');

        // Check if user exists, if not create new user
        const existingUser = await User.findOne({ email: user.email });
        console.log('🔍 Existing user found:', !!existingUser);

        if (!existingUser) {
          console.log('➕ Creating new user...');
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
          console.log('✅ New user created');
        }

        console.log('✅ SignIn callback completed successfully');
        return true;
      } catch (error) {
        console.error('❌ SignIn callback error:', error);
        // Return true anyway to not block sign-in due to DB issues
        // User will be created on next attempt
        return true;
      }
    },
        // ADD THIS JWT CALLBACK
    async jwt({ token, user, account }) {
      // On sign in, add user ID to token
      if (user) {
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.id = dbUser._id.toString(); // ← This adds the ID to the token
          }
        } catch (error) {
          console.error('❌ JWT callback error:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      try {
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
          } else {
            console.warn('⚠️ User not found in database for email:', session.user.email);
          }
        }
      } catch (error) {
        console.error('❌ Session callback error:', error);
        // Don't throw - return session without extra data
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
  
  // Production settings for Vercel
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  
  // Enable debug mode to see detailed logs
  debug: process.env.NODE_ENV === 'development',
};