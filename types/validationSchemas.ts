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
  group: z.number({
    required_error: "กรุณาเลือกกลุ่มงาน",
  }),
  phone: z.coerce
    .number({
      invalid_type_error: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง",
    })
    .int()
    .gte(1, "กรุณากรอกเบอร์โทรศัพท์")
    .gte(10000, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง")
    .lte(9999999999, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง"),
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
});
