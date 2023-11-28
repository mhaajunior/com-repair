export const statusMap = {
  OPEN: { value: "open", label: "รอการตอบรับ", color: "blue" },
  ACKNOWLEDGE: { value: "acknowledge", label: "รับทราบงาน", color: "orange" },
  IN_PROGRESS: {
    value: "in_progress",
    label: "กำลังดำเนินการ",
    color: "teal",
  },
  NOTIFY: { value: "notify", label: "แจ้งซ่อมกลุ่มพัสดุ", color: "indigo" },
  CANT_FIX: { value: "cant_fix", label: "ซ่อมไม่ได้", color: "purple" },
  CANCELED: { value: "canceled", label: "ยกเลิก", color: "gray" },
  CLOSED: { value: "closed", label: "เสร็จเรียบร้อย", color: "green" },
};
