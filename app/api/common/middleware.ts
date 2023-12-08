import prisma from "@/prisma/db";
import { Role } from "@prisma/client";

export const validateUser = async (
  userId: string | null,
  adminCheck: boolean = false
) => {
  if (!userId) return false;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return false;
    }

    if (adminCheck && user.role !== Role.ADMIN) {
      return false;
    }

    return user;
  } catch (e) {
    throw e;
  }
};
