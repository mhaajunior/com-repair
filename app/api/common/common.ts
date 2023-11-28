import prisma from "@/prisma/db";

export const validateUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return false;
    }
    return true;
  } catch (e) {
    throw e;
  }
};
