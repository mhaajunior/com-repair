import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { SelectOption } from "@/types/inputProps";

export const getProblems = async () => {
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
