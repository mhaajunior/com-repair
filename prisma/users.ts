import { Role } from "@prisma/client";

export const users = [
  {
    email: "junior29958@gmail.com",
    password: "Test@test",
    name: "ธีธัช",
    surname: "วระโพธิ์",
    role: Role.ADMIN,
  },
  {
    email: "officer@test.com",
    password: "Officer@test",
    name: "เจ้าหน้าที่",
    surname: "ทดสอบ",
  },
];
