import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null

      try {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })

        if (!user) return null
        if (user.suspended) return null

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: null,
        }
      } catch (error) {
        console.error('Login error:', error)
        return null
      }
    },
  }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          await prisma.user.upsert({
            where: { email: user.email.toLowerCase() },
            update: { name: user.name ?? undefined },
            create: {
              name: user.name ?? 'User',
              email: user.email.toLowerCase(),
              passwordHash: crypto.randomBytes(32).toString('hex'),
              emailVerified: true,
              profile: { create: {} },
            },
          })
        } catch (error) {
          console.error('Google sign-in user sync error:', error)
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role ?? 'SEEKER'
        if (user.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email.toLowerCase() },
              select: { id: true, role: true },
            })
            if (dbUser) {
              token.id = dbUser.id
              token.role = dbUser.role
            }
          } catch {
            // DB unavailable — keep the values above
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as string) ?? 'SEEKER'
      }
      return session
    },
  },
}
