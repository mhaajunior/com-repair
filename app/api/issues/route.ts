import { createIssueSchema, editIssueSchema } from "@/types/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { Prisma, Role, Status } from "@prisma/client";
import { validateUser } from "../common/middleware";

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

export const PATCH = async (req: NextRequest) => {
  const body = await req.json();
  const userId = req.headers.get("user-id");
  const validation = editIssueSchema.safeParse(body);

  const {
    id,
    status,
    fixResult,
    officerId,
    startDate,
    endDate,
    note,
    isCompleted,
  } = body;

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  let trimFixResult = fixResult;
  let trimNote = note;

  if (trimFixResult) {
    trimFixResult = fixResult.trim();
  }

  if (trimNote) {
    trimNote = note.trim();
  }

  if (
    (status === Status.CLOSED ||
      status === Status.NOTIFY ||
      status === Status.CANT_FIX) &&
    !trimFixResult
  ) {
    return NextResponse.json("กรุณากรอกสรุปผลการซ่อม", { status: 400 });
  }

  try {
    let user: any;
    if (!userId) {
      return NextResponse.json(null, { status: 401 });
    } else {
      const adminCheck = status === Status.CANCELED;
      user = await validateUser(userId, adminCheck);
      if (!user) {
        return NextResponse.json("ข้อมูลผู้ใช้ไม่ถูกต้อง", { status: 401 });
      }
    }

    const found = await prisma.issue.findUnique({
      where: { id },
      include: {
        officer: {
          select: {
            role: true,
          },
        },
      },
    });

    if (!found) {
      return NextResponse.json("ใบแจ้งซ่อมไม่ถูกต้อง", { status: 400 });
    }

    if (
      found.officer &&
      found.officerId !== userId &&
      user.role !== Role.ADMIN
    ) {
      return NextResponse.json(
        "ไม่สามารถแก้งานที่ดำเนินการโดยเจ้าหน้าที่คนอื่นได้",
        { status: 400 }
      );
    }

    const updateIssue = await prisma.issue.update({
      where: {
        id,
      },
      data: {
        status,
        officerId,
        fixStartDate: startDate,
        fixEndDate: endDate,
        fixResult: trimFixResult,
        note: trimNote,
        isCompleted,
      },
    });

    return NextResponse.json(updateIssue);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
