import prisma from "@/prisma/db";

export const validateUser = async (userId: string | null) => {
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
    return user;
  } catch (e) {
    throw e;
  }
};
