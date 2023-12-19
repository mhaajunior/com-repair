import prisma from "@/prisma/db";
import { createTeamGroupSchema } from "@/types/validationSchemas";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { validateUser } from "../middleware";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const userId = req.headers.get("user-id");
  const validation = createTeamGroupSchema.safeParse(body);

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

    const newGroup = await prisma.group.create({
      data: body,
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};

export const GET = async () => {
  try {
    const groups = await prisma.group.findMany({
      select: {
        id: true,
        label: true,
        teamId: true,
      },
    });

    return NextResponse.json(groups);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
