import { Status } from "@prisma/client";
import { z } from "zod";

export const createIssueSchema = z.object({
  name: z
    .string()
    .min(1, "กรุณากรอกชื่อ")
    .max(32, "ชื่อที่กรอกยาวเกินกว่าที่กำหนด"),
  surname: z
    .string()
    .min(1, "กรุณากรอกนามสกุล")
    .max(32, "นามสกุลที่กรอกยาวเกินกว่าที่กำหนด"),
  team: z.number({
    required_error: "กรุณาเลือกศูนย์/สำนัก/กอง",
  }),
  group: z
    .number({
      required_error: "กรุณาเลือกกลุ่มงาน",
    })
    .positive("กรุณาเลือกกลุ่มงาน"),
  phone: z
    .string()
    .min(1, "กรุณากรอกเบอร์โทรศัพท์")
    .max(10, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง"),
  problem: z.number({
    required_error: "กรุณาเลือกประเภทของปัญหา",
  }),
  detail: z
    .string()
    .min(1, "กรุณากรอกรายละเอียด")
    .max(255, "รายละเอียดที่กรอกยาวเกินกว่าที่กำหนด"),
});

export const searchIssueSchema = z.object({
  id: z.coerce
    .number({
      invalid_type_error: "กรุณากรอกหมายเลขใบแจ้งเป็นตัวเลข",
    })
    .optional(),
  fullname: z
    .string()
    .max(64, "ชื่อ-นามสกุลที่กรอกยาวเกินกว่าที่กำหนด")
    .optional(),
  rangeDate: z.any().optional(),
});

export const signInSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมล"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export const editIssueSchema = z.object({
  id: z.number(),
  status: z.nativeEnum(Status, {
    required_error: "กรุณาเลือกสถานะงาน",
  }),
  fixResult: z
    .string()
    .max(255, "รายละเอียดที่กรอกยาวเกินกว่าที่กำหนด")
    .nullable()
    .optional(),
  officerId: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  note: z
    .string()
    .max(255, "รายละเอียดที่กรอกยาวเกินกว่าที่กำหนด")
    .nullable()
    .optional(),
  isCompleted: z.boolean().optional(),
});

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "กรุณากรอกชื่อ")
    .max(32, "รายละเอียดที่กรอกยาวเกินกว่าที่กำหนด"),
  surname: z
    .string()
    .min(1, "กรุณากรอกนามสกุล")
    .max(32, "รายละเอียดที่กรอกยาวเกินกว่าที่กำหนด"),
  email: z
    .string()
    .min(1, "กรุณากรอกอีเมล")
    .max(32, "รายละเอียดที่กรอกยาวเกินกว่าที่กำหนด"),
  password: z
    .string()
    .min(1, "กรุณากรอกรหัสผ่าน")
    .max(32, "รายละเอียดที่กรอกยาวเกินกว่าที่กำหนด"),
});

export const editUserSchema = z.object({
  name: z
    .string()
    .min(1, "กรุณากรอกชื่อ")
    .max(32, "รายละเอียดที่กรอกยาวเกินกว่าที่กำหนด"),
  surname: z
    .string()
    .min(1, "กรุณากรอกนามสกุล")
    .max(32, "รายละเอียดที่กรอกยาวเกินกว่าที่กำหนด"),
  email: z
    .string()
    .min(1, "กรุณากรอกอีเมล")
    .max(32, "รายละเอียดที่กรอกยาวเกินกว่าที่กำหนด"),
  password: z
    .string()
    .max(32, "รายละเอียดที่กรอกยาวเกินกว่าที่กำหนด")
    .optional(),
  confPassword: z
    .string()
    .max(32, "รายละเอียดที่กรอกยาวเกินกว่าที่กำหนด")
    .optional(),
});
