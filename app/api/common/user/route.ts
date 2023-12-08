import { roleMap } from "@/helpers/roleMap";
import prisma from "@/prisma/db";
import { UserProps } from "@/types/userProps";
import { Prisma } from "@prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createUserSchema } from "@/types/validationSchemas";
import { validateUser } from "../middleware";

export const GET = async () => {
  try {
    const filteredUsers: { text: string; value: string }[] = [];
    const users: UserProps[] = [];

    const res = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        createdAt: true,
        role: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    res.forEach((user, index) => {
      filteredUsers.push({
        text: `${user.name} ${user.surname}`,
        value: `${user.name} ${user.surname}`,
      });

      users.push({
        key: index + 1,
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        role: roleMap[user.role],
        createdAt: moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      });
    });

    return NextResponse.json({ filteredUsers, users });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const userId = req.headers.get("user-id");
  const validation = createUserSchema.safeParse(body);

  const { email, name, surname, password } = body;

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  try {
    if (!userId) {
      return NextResponse.json(null, { status: 401 });
    } else {
      if (!(await validateUser(userId, true))) {
        return NextResponse.json("ข้อมูลผู้ใช้ไม่ถูกต้อง", { status: 401 });
      }
    }

    const found = await prisma.user.findUnique({
      where: { email },
    });

    if (found) {
      return NextResponse.json("อีเมลนี้ได้ทำการลงทะเบียนไว้แล้ว", {
        status: 400,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        surname,
        password: hashPassword,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
