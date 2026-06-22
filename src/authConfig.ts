import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error('No email found in Google profile'), null);

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            id: Date.now(),
            email,
            username: profile.displayName || email.split('@')[0],
            password: 'oauth_user_' + Date.now(),
          },
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err as Error, undefined);
    }
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: '/auth/github/callback'
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
      
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            id: Date.now(),
            email,
            username: profile.username,
            password: 'oauth_user_' + Date.now(),
          },
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err as Error, undefined);
    }
  }
));

export { passport };
