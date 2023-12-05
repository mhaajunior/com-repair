import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { SelectOptionWithTeam } from "@/types/selectOption";
import { SelectOption } from "@/types/selectOption";

export const GET = async (req: NextRequest) => {
  try {
    const teams = await getTeams();
    const groups = await getGroups();
    const problems = await getProblems();

    return NextResponse.json({ teams, groups, problems });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};

const getGroups = async () => {
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

const getProblems = async () => {
  try {
    const dropdownProblems: SelectOption[] = [];

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

    return dropdownProblems;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};

const getTeams = async () => {
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



