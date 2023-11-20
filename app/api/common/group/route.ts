import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { SelectOptionWithTeam } from "@/types/inputProps";

export const getGroups = async () => {
  try {
    const dropdownGroups: SelectOptionWithTeam[] = [];

    const groups = await prisma.group.findMany({
      select: {
        id: true,
        label: true,
        teamId: true,
      },
    });

    groups.map((group) =>
      dropdownGroups.push({
        value: group.id,
        label: group.label,
        teamId: group.teamId,
      })
    );

    return dropdownGroups;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
