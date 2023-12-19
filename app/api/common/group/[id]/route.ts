import { NextRequest, NextResponse } from "next/server";
import { validateUser } from "../../middleware";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: number } }
) => {
  const body = await req.json();
  const userId = req.headers.get("user-id");
  const editGroupId: number = Number(params.id);

  try {
    if (!userId) {
      return NextResponse.json(null, { status: 401 });
    } else {
      const user = await validateUser(userId, true);
      if (!user) {
        return NextResponse.json("ข้อมูลผู้ใช้ไม่ถูกต้อง", { status: 401 });
      }
    }
    const found = await prisma.group.findUnique({
      where: { id: editGroupId },
    });

    if (!found) {
      return NextResponse.json("กลุ่มที่จะแก้ไขไม่ถูกต้อง", {
        status: 400,
      });
    }

    const updateUser = await prisma.group.update({
      where: {
        id: editGroupId,
      },
      data: body,
    });

    return NextResponse.json(updateUser);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: number } }
) => {
  const userId = req.headers.get("user-id");
  const deleteGroupId = Number(params.id);

  try {
    if (!userId) {
      return NextResponse.json(null, { status: 401 });
    } else {
      const user = await validateUser(userId, true);
      if (!user) {
        return NextResponse.json("ข้อมูลผู้ใช้ไม่ถูกต้อง", { status: 401 });
      }
    }

    const found = await prisma.group.findUnique({
      where: { id: deleteGroupId },
    });

    if (!found) {
      return NextResponse.json("กลุ่มที่จะลบไม่ถูกต้อง", {
        status: 400,
      });
    }

    await prisma.group.delete({
      where: {
        id: deleteGroupId,
      },
    });

    return NextResponse.json("ลบสำเร็จ");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
