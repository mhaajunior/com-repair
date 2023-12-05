import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { SelectOption } from "@/types/selectOption";

export const getTeams = async () => {
  try {
    const dropdownTeams: SelectOption[] = [];

    const teams = await prisma.team.findMany({
      select: {
        id: true,
        label: true,
        abb: true,
      },
    });

    for (let team of teams) {
      dropdownTeams.push({
        value: team.id,
        label: `${team.label} (${team.abb})`,
      });
    }

    return dropdownTeams;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
