import prisma from "@/prisma/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { IUser } from "@/types/next-auth";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "อีเมล",
          type: "text",
          placeholder: "อีเมล",
        },
        password: {
          label: "รหัสผ่าน",
          type: "password",
          placeholder: "รหัสผ่าน",
        },
      },
      async authorize(credentials) {
        if (credentials) {
          try {
            const foundUser = await prisma.user.findUnique({
              where: {
                email: credentials.email,
              },
            });

            if (
              foundUser &&
              (await bcrypt.compare(credentials.password, foundUser.password))
            ) {
              foundUser.password = "";
              return foundUser;
            }
          } catch (error) {
            console.log(error);
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: IUser }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.surname = user.surname;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.surname = token.surname;
      }
      return session;
    },
  },
};
