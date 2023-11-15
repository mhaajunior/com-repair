import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { SelectOptionType } from "@/types/inputProps";

export const GET = async (req: NextRequest) => {
  try {
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        label: true,
        abb: true,
      },
    });

    const dropdownTeams: SelectOptionType[] = [];
    const dropdownProblems: SelectOptionType[] = [];
    for (let team of teams) {
      dropdownTeams.push({
        value: team.id,
        label: `${team.label} (${team.abb})`,
      });
    }

    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        label: true,
      },
    });
    problems.map((problem) =>
      dropdownProblems.push({
        value: problem.id,
        label: problem.label,
      })
    );

    return NextResponse.json({ dropdownTeams, dropdownProblems });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
