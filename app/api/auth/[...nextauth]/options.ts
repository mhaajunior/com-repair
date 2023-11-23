import prisma from "@/prisma/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

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

            if (foundUser && foundUser.password) {
              const match = await bcrypt.compare(
                credentials.password,
                foundUser.password
              );

              if (match) {
                return {
                  id: foundUser.id,
                  name: foundUser.name,
                  surname: foundUser.surname,
                  email: foundUser.email,
                  role: foundUser.role,
                };
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
