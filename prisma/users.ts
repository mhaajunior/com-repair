import { Role } from "@prisma/client";

export const users = [
  {
    email: "admin@test.com",
    password: "Admin@test",
    name: "แอดมิน",
    surname: "ทดสอบ",
    role: Role.ADMIN,
  },
  {
    email: "officer@test.com",
    password: "Officer@test",
    name: "เจ้าหน้าที่",
    surname: "ทดสอบ",
  },
];
