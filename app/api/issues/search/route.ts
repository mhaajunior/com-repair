import { searchIssueSchema } from "@/types/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import moment from "moment";
import { CountIssue, Issue, SearchIssueParams } from "@/types/issue";
import { statusMap } from "@/helpers/statusMap";
import { validateUser } from "../../common/middleware";
import { getQuarterDate } from "@/helpers/date";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const userId = req.headers.get("user-id");
  if (userId) {
    return officerFetchIssues(body, userId);
  } else {
    return userFetchIssues(body);
  }
};

const userFetchIssues = async (body: SearchIssueParams) => {
  const validation = searchIssueSchema.safeParse(body);

  const { id, fullname } = body;
  let trimFullname = "";
  let name = "";
  let surname = "";

  if (fullname) trimFullname = fullname?.trim();

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
        phone: issue.phone,
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

const officerFetchIssues = async (body: SearchIssueParams, userId: string) => {
  const validation = searchIssueSchema.safeParse(body);
  const { id, fullname, rangeDate } = body;
  let trimFullname = "";
  let name = "";
  let surname = "";
  let startDate = "";
  let endDate = "";

  if (fullname) trimFullname = fullname?.trim();

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

  if (rangeDate) {
    startDate = moment(rangeDate[0]).format("YYYY-MM-DD 00:00:00");
    endDate = moment(rangeDate[1]).format("YYYY-MM-DD 23:59:59");
    startDate = new Date(startDate).toISOString();
    endDate = new Date(endDate).toISOString();
  } else {
    const dateObj = getQuarterDate();
    startDate = new Date(dateObj.startDate).toISOString();
    endDate = new Date(dateObj.endDate).toISOString();
  }

  let whereObj: any = {};

  whereObj.createdAt = {
    gte: startDate,
    lte: endDate,
  };

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
    if (!validateUser(userId)) {
      return NextResponse.json({ status: 401 });
    }

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
        phone: issue.phone,
        detail: issue.detail,
        fixResult: issue.fixResult,
        createdAt: moment(issue.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        workGroup: issue.group.label + " " + issue.team.abb,
        problem: issue.problem.label,
        officer: null,
      })
    );

    const countIssues: CountIssue = { ALL: 0 };
    let total = 0;
    const groupIssues = await prisma.issue.groupBy({
      by: ["status"],
      where: whereObj,
      _count: true,
    });

    for (let issue of groupIssues) {
      countIssues[issue.status] = issue._count;
      total += issue._count;
    }
    countIssues["ALL"] = total;

    return NextResponse.json({ issues, countIssues });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
