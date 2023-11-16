import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { SelectOptionType } from "@/types/inputProps";

export const GET = async (req: NextRequest) => {
  try {
    const dropdownTeams: SelectOptionType[] = [];

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

    return NextResponse.json(dropdownTeams);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
