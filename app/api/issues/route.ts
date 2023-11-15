import { createIssueSchema } from "@/types/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = createIssueSchema.safeParse(body);

  const { name, surname, team, group, phone, problem, detail } = body;

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const trimName = name.trim();
  const trimSurname = surname.trim();
  const trimPhone = phone.toString().trim();
  const trimDetail = detail.trim();

  if (!trimName || !trimSurname || !trimPhone || !trimDetail) {
    return NextResponse.json("ข้อมูลที่กรอกมีข้อมูลว่าง", { status: 400 });
  }

  try {
    const newIssue = await prisma.issue.create({
      data: {
        name: trimName,
        surname: trimSurname,
        team,
        group,
        phone: trimPhone,
        problem,
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
