import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const filteredUsers = [];

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
      },
    });

    for (let user of users) {
      filteredUsers.push({
        text: `${user.name} ${user.surname}`,
        value: `${user.name} ${user.surname}`,
      });
    }

    return NextResponse.json(filteredUsers);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
