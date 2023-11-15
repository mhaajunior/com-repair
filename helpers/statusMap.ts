export const statusMap = {
  OPEN: { label: "รอการตอบรับ", color: "blue" },
  ACKNOWLEDGE: { label: "รับทราบงาน", color: "orange" },
  IN_PROGRESS: { label: "กำลังดำเนินการ", color: "yellow" },
  NOTIFY: { label: "แจ้งซ่อมกลุ่มพัสดุ", color: "pink" },
  CANT_FIX: { label: "ซ่อมไม่ได้", color: "purple" },
  CANCELED: { label: "ยกเลิก", color: "red" },
  CLOSED: { label: "เสร็จเรียบร้อย", color: "green" },
};
