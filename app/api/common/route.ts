import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getTeams } from "./team/team";
import { getGroups } from "./group/group";
import { getProblems } from "./problem/problem";

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
