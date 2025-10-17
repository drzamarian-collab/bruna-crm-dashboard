import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Admin credentials from environment
        const adminEmail = process.env.ADMIN_EMAIL || "drzamarian@gmail.com";
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";

        // Check if email matches
        if (credentials.email !== adminEmail) {
          return null;
        }

        // Verify password
        const isPasswordValid = await compare(
          credentials.password,
          adminPasswordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        // Return user object
        return {
          id: "1",
          email: adminEmail,
          name: "Dr. Walter Zamarian Jr.",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
