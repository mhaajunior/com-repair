export const statusMap = {
  OPEN: { value: "open", label: "รอการตอบรับ", color: "Navy" },
  ACKNOWLEDGE: {
    value: "acknowledge",
    label: "รับทราบงาน",
    color: "Indigo",
  },
  IN_PROGRESS: {
    value: "in_progress",
    label: "กำลังดำเนินการ",
    color: "MediumVioletRed",
  },
  NOTIFY: {
    value: "notify",
    label: "แจ้งซ่อมกลุ่มพัสดุ",
    color: "Chocolate",
  },
  CANT_FIX: { value: "cant_fix", label: "ซ่อมไม่ได้", color: "DarkRed" },
  CANCELED: { value: "canceled", label: "ยกเลิก", color: "DarkSlateGrey" },
  CLOSED: { value: "closed", label: "เสร็จเรียบร้อย", color: "DarkGreen" },
};
