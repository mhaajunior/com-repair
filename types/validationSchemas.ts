import { z } from "zod";
import validator from "validator";

export const createIssueSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  surname: z.string().min(1, "กรุณากรอกนามสกุล"),
  team: z.number({
    required_error: "กรุณาเลือกศูนย์/สำนัก/กอง",
  }),
  group: z.number({
    required_error: "กรุณาเลือกกลุ่มงาน",
  }),
  phone: z
    .string()
    .min(1, "กรุณากรอกเบอร์โทรศัพท์")
    .refine(validator.isMobilePhone, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง"),
  problem: z.number({
    required_error: "กรุณาเลือกประเภทของปัญหา",
  }),
  detail: z
    .string()
    .min(1, "กรุณากรอกรายละเอียด")
    .max(255, "รายละเอียดที่กรอกมากเกินกว่าที่กำหนด"),
});
