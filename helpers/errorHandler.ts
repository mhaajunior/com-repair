import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

export const errorHandler = (err: Error | AxiosError) => {
  let text = "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง";
  if (axios.isAxiosError(err)) {
    if (!err?.response) {
      text = "ไม่มีการตอบสนองจากเซิฟเวอร์ กรุณาลองใหม่อีกครั้ง";
    } else if (err.response?.status === 400) {
      text = "ข้อมูลที่กรอกไม่ถูกต้อง กรุณาตรวจสอบข้อมูลให้ถูกต้อง";
    } else if (err.response?.status === 401) {
      text = "ยังไม่ได้ทำการเข้าสู่ระบบ กรุณาเข้าสู่ระบบก่อน";
    }
  }

  Swal.fire({
    icon: "error",
    title: "Error",
    text,
  });
};
