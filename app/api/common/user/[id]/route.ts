import { NextRequest, NextResponse } from "next/server";
import { validateUser } from "../../middleware";
import prisma from "@/prisma/db";
import { Prisma, Role, Status } from "@prisma/client";
import { editUserSchema } from "@/types/validationSchemas";
import bcrypt from "bcrypt";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const body = await req.json();
  const userId = req.headers.get("user-id");
  const editUserId = params.id;
  const validation = editUserSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  try {
    if (!userId) {
      return NextResponse.json(null, { status: 401 });
    } else {
      const user = await validateUser(userId, true);
      if (!user) {
        return NextResponse.json("ข้อมูลผู้ใช้ไม่ถูกต้อง", { status: 401 });
      } else {
        if (user.id === editUserId) {
          return NextResponse.json("ไม่สามารถแก้ไขรหัสนี้ได้", { status: 400 });
        }
      }
    }

    const found = await prisma.user.findUnique({
      where: { id: editUserId },
    });

    if (!found) {
      return NextResponse.json("รหัสที่จะแก้ไขไม่ถูกต้อง", {
        status: 400,
      });
    }

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const updateUser = await prisma.user.update({
      where: {
        id: editUserId,
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

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const userId = req.headers.get("user-id");
  const promoteUserId = params.id;
  let role: Role;

  try {
    if (!userId) {
      return NextResponse.json(null, { status: 401 });
    } else {
      const user = await validateUser(userId, true);
      if (!user) {
        return NextResponse.json("ข้อมูลผู้ใช้ไม่ถูกต้อง", { status: 401 });
      } else {
        if (user.id === promoteUserId) {
          return NextResponse.json("ไม่สามารถเปลี่ยนสิทธิรหัสนี้ได้", {
            status: 400,
          });
        }
      }
    }

    const found = await prisma.user.findUnique({
      where: { id: promoteUserId },
    });

    if (!found) {
      return NextResponse.json("รหัสที่จะเปลี่ยนสิทธิไม่ถูกต้อง", {
        status: 400,
      });
    }
    role = found.role;

    const updateUser = await prisma.user.update({
      where: {
        id: promoteUserId,
      },
      data: {
        role: role === Role.OFFICER ? Role.ADMIN : Role.OFFICER,
      },
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
  { params }: { params: { id: string } }
) => {
  const userId = req.headers.get("user-id");
  const deleteUserId = params.id;

  try {
    if (!userId) {
      return NextResponse.json(null, { status: 401 });
    } else {
      const user = await validateUser(userId, true);
      if (!user) {
        return NextResponse.json("ข้อมูลผู้ใช้ไม่ถูกต้อง", { status: 401 });
      } else {
        if (user.id === deleteUserId) {
          return NextResponse.json("ไม่สามารถลบรหัสนี้ได้", { status: 400 });
        }
      }
    }

    const found = await prisma.user.findUnique({
      where: { id: deleteUserId },
    });

    if (!found) {
      return NextResponse.json("รหัสที่จะลบไม่ถูกต้อง", {
        status: 400,
      });
    }

    await prisma.issue.updateMany({
      where: { officerId: deleteUserId, isCompleted: false },
      data: {
        status: Status.ACKNOWLEDGE,
        fixStartDate: null,
        officerId: null,
      },
    });

    await prisma.user.delete({
      where: {
        id: deleteUserId,
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
