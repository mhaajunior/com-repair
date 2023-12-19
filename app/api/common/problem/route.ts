import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        label: true,
      },
    });

    return NextResponse.json(problems);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
