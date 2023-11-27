import { searchIssueSchema } from "@/types/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import moment from "moment";
import { Issue } from "@/types/outputProps";
import { statusMap } from "@/helpers/statusMap";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = searchIssueSchema.safeParse(body);

  const { id, fullname } = body;
  const trimFullname = fullname.trim();
  let name = "";
  let surname = "";

  if (!id && !trimFullname) {
    return NextResponse.json("กรุณาใส่ข้อมูลอย่างน้อย 1 ช่อง", { status: 400 });
  }

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  if (trimFullname) {
    if (trimFullname.includes(" ")) {
      name = trimFullname.split(" ")[0];
      surname = trimFullname.split(" ")[1];
    } else {
      name = trimFullname;
    }
  }

  let whereObj: any = {};
  if (id) {
    whereObj.id = { equals: id };
  }
  if (name) {
    whereObj.name = {
      contains: name,
    };
  }
  if (surname) {
    whereObj.surname = {
      contains: surname,
    };
  }

  try {
    const res = await prisma.issue.findMany({
      where: whereObj,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      include: {
        team: {
          select: {
            abb: true,
          },
        },
        group: {
          select: {
            label: true,
          },
        },
        problem: {
          select: {
            label: true,
          },
        },
      },
    });

    const issues: Issue[] = [];

    res.forEach((issue, index) =>
      issues.push({
        key: index + 1,
        id: issue.id,
        sender: issue.name + " " + issue.surname,
        status: statusMap[issue.status],
        detail: issue.detail,
        fixResult: issue.fixResult,
        createdAt: moment(issue.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        workGroup: issue.group.label + " " + issue.team.abb,
        problem: issue.problem.label,
        officer: null,
      })
    );

    return NextResponse.json(issues);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
