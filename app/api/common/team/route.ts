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

    const newTeam = await prisma.team.create({
      data: body,
    });

    return NextResponse.json(newTeam, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};

export const GET = async () => {
  try {
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        label: true,
        abb: true,
      },
    });

    return NextResponse.json(teams);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
