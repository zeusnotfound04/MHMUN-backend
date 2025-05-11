import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// Define specific types for our callbacks
type JWTCallbackParams = {
  token: JWT;
  user: User | undefined;
};

type SessionCallbackParams = {
  session: Session;
  token: JWT;
};



export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge : 30 * 24 * 60 * 60 // 30 days
  
  },

  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'hello@example.com',
        },
        password:
         { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email and password are required');
        }
          
   
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select : {
            id : true,
            email : true,
            username : true,
            role : true,
            password : true,
          }
        });

        if (!user) {
          throw new Error('No user found with the provided email');
        }

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error('Incorrect password');
        }
        

        return user;
      },
    }),
  ],

  callbacks: {
    
    async jwt({ token, user }: JWTCallbackParams) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: SessionCallbackParams) {
      session.user = {
        id: token.id,
        username: token.username,
        role: token.role,
        email: token.email,
      };
      
      return session;
    },
  },
};