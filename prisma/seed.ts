import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { teams } from "./teams";
import { groups } from "./groups";
import { problems } from "./problems";
import { users } from "./users";

const prisma = new PrismaClient();

async function main() {
  for (let team of teams) {
    await prisma.team.upsert({
      where: { label: team.label },
      update: {},
      create: {
        label: team.label,
        abb: team.abb,
      },
    });
  }

  for (let group of groups) {
    await prisma.group.upsert({
      where: { labelTeam: { label: group.label, teamId: group.teamId } },
      update: {},
      create: {
        label: group.label,
        teamId: group.teamId,
      },
    });
  }

  for (let problem of problems) {
    await prisma.problem.upsert({
      where: { label: problem.label },
      update: {},
      create: {
        label: problem.label,
      },
    });
  }

  for (let user of users) {
    const hashPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { role: user.role },
      create: {
        email: user.email,
        password: hashPassword,
        name: user.name,
        surname: user.surname,
        role: user.role,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
