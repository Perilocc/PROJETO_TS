import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { userLogin } from "./services/authService";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await userLogin(
            credentials.email as string,
            credentials.senha as string
          );

          if (response && response.token) {
            return {
              id: response.user.id.toString(),
              name: response.user.nome,
              email: response.user.email,
              token: response.token,
              papel: response.user.papel,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
        token.papel = user.papel;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.token = token.token as string;
        session.user.papel = token.papel as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
