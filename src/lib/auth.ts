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
    async signIn({ user }) {
      try {
        await dbConnect();
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
      } catch (error) {
        console.error('SignIn error:', error);
        return true;
      }
    },
    
    async jwt({ token, user }) {
      // CRITICAL: Add user ID to JWT token on first sign in
      if (user) {
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
          }
        } catch (error) {
          console.error('JWT error:', error);
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      try {
        if (session.user && token.id) {
          // Add ID from token
          session.user.id = token.id as string;
          
          await dbConnect();
          const dbUser = await User.findById(token.id);
          
          if (dbUser) {
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
      } catch (error) {
        console.error('Session error:', error);
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
   useSecureCookies: false,
    // ADD THESE LINES:
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, // Set to false for localhost
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: false,
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false,
      },
    },
  },
};