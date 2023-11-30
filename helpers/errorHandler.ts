import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

export const errorHandler = (err: Error | AxiosError) => {
  let text = "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง";
  if (axios.isAxiosError(err)) {
    if (err?.response?.data) {
      if (typeof err?.response?.data === "string") {
        text = err.response.data;
      } else {
        text = "ประเภทของข้อมูลไม่ถูกต้อง";
      }
    } else {
      if (err.response?.status === 500) {
        text = "ไม่มีการตอบสนองจากเซิฟเวอร์ กรุณาลองใหม่อีกครั้ง";
      } else if (err.response?.status === 400) {
        text = "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง";
      } else if (err.response?.status === 401) {
        text = "ยังไม่ได้ทำการเข้าสู่ระบบ กรุณาเข้าสู่ระบบก่อน";
      }
    }
  }

  Swal.fire({
    icon: "error",
    title: "Error",
    text,
  });
};
