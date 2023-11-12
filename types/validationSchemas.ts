import { z } from "zod";

export const createIssueSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  surname: z.string().min(1, "กรุณากรอกนามสกุล"),
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
    .max(255, "รายละเอียดที่กรอกมากเกินกว่าที่กำหนด"),
});
