import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { SelectOptionType } from "@/types/inputProps";

interface TeamId {
  teamId: string;
}

export const GET = async (req: NextRequest, { params }: { params: TeamId }) => {
  try {
    const dropdownGroups: SelectOptionType[] = [];

    const groups = await prisma.group.findMany({
      where: { teamId: parseInt(params.teamId) },
      select: {
        id: true,
        label: true,
      },
    });

    groups.map((group) =>
      dropdownGroups.push({
        value: group.id,
        label: group.label,
      })
    );

    return NextResponse.json(dropdownGroups);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
