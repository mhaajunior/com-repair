import { Role } from "@prisma/client";
import NextAuth, { Account, DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: IUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}

interface IUser extends User {
  role?: Role;
  surname?: string;
}
