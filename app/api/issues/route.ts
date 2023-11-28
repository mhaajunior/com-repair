import { createIssueSchema } from "@/types/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { CountIssue } from "@/types/issue";
import { getQuarterDate } from "@/helpers/date";
import { validateUser } from "../common/common";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = createIssueSchema.safeParse(body);

  const { name, surname, team, group, phone, problem, detail } = body;

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const trimName = name.trim();
  const trimSurname = surname.trim();
  const trimPhone = phone.trim();
  const trimDetail = detail.trim();

  if (!trimName || !trimSurname || !trimPhone || !trimDetail) {
    return NextResponse.json("ข้อมูลที่กรอกมีข้อมูลว่าง", { status: 400 });
  }

  try {
    const newIssue = await prisma.issue.create({
      data: {
        name: trimName,
        surname: trimSurname,
        teamId: team,
        groupId: group,
        phone: trimPhone,
        problemId: problem,
        detail: trimDetail,
      },
    });
    return NextResponse.json(newIssue, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};

export const GET = async (req: NextRequest) => {
  const userId = req.headers.get("user-id");

  try {
    if (userId && !(await validateUser(userId))) {
      return NextResponse.json("ผู้ใช้งานไม่ถูกต้อง", { status: 400 });
    }

    const countIssues: CountIssue = { ALL: 0 };
    const dateObj = getQuarterDate();
    let total = 0;
    const groupIssues = await prisma.issue.groupBy({
      by: ["status"],
      where: {
        createdAt: {
          gte: new Date(dateObj.startDate).toISOString(),
          lte: new Date(dateObj.endDate).toISOString(),
        },
      },
      _count: true,
    });

    for (let issue of groupIssues) {
      countIssues[issue.status] = issue._count;
      total += issue._count;
    }
    countIssues["ALL"] = total;

    return NextResponse.json(countIssues);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
