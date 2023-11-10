"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/types/validationSchemas";
import { SelectOptionType } from "@/types/inputProps";
import InputWrap from "@/components/inputGroup/InputWrap";
import Input from "@/components/inputGroup/Input";
import Dropdown from "@/components/inputGroup/Dropdown";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });

  // hard code
  const options: SelectOptionType[] = [
    {
      value: 1,
      label: "แสดงครัวเรือนทั้งหมด",
    },
    {
      value: 2,
      label: "แสดงครัวเรือนที่มีความผิดพลาด",
    },
  ];

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await axios.post("/api/issues", data);
      router.push("/");
    } catch (err) {
      setLoading(false);
      setError("เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง");
    }
  });

  return (
    <div className="sm:px-24 py-5">
      <h1 className="text-3xl">
        แบบฟอร์มการแจ้งซ่อมคอมพิวเตอร์ออนไลน์และอุปกรณ์ต่อพ่วง
      </h1>
      <form className="card" onSubmit={onSubmit}>
        <InputWrap label="ชื่อ*" isValid={!errors.name}>
          <Input
            name="name"
            placeholder="ชื่อ"
            register={register}
            className="w-72"
          />
          {<ErrorMessage>{errors.name?.message}</ErrorMessage>}
        </InputWrap>
        <InputWrap label="นามสกุล*" isValid={!errors.surname}>
          <Input
            name="surname"
            placeholder="นามสกุล"
            register={register}
            className="w-72"
          />
          {<ErrorMessage>{errors.surname?.message}</ErrorMessage>}
        </InputWrap>
        <InputWrap label="ศูนย์/สำนัก/กอง*" isValid={!errors.team}>
          <Dropdown
            name="team"
            placeholder="ศูนย์/สำนัก/กอง"
            options={options}
            className="w-72"
            control={control}
          />
          {<ErrorMessage>{errors.team?.message}</ErrorMessage>}
        </InputWrap>
        <InputWrap label="กลุ่มงาน*" isValid={!errors.group}>
          <Dropdown
            name="group"
            placeholder="กลุ่มงาน"
            options={options}
            className="w-72"
            control={control}
          />
          {<ErrorMessage>{errors.group?.message}</ErrorMessage>}
        </InputWrap>
        <InputWrap label="เบอร์โทรศัพท์*" isValid={!errors.phone}>
          <Input
            name="phone"
            placeholder="เบอร์โทรศัพท์"
            register={register}
            className="w-72"
          />
          {<ErrorMessage>{errors.phone?.message}</ErrorMessage>}
        </InputWrap>
        <InputWrap label="ประเภทของปัญหา*" isValid={!errors.problem}>
          <Dropdown
            name="problem"
            placeholder="ประเภทของปัญหา"
            options={options}
            className="w-72"
            control={control}
          />
          {<ErrorMessage>{errors.problem?.message}</ErrorMessage>}
        </InputWrap>
        <InputWrap label="รายละเอียดอาการเสีย/ปัญหา*" isValid={!errors.detail}>
          <Input
            name="detail"
            placeholder="เขียนรายละเอียดอาการเสีย/ปัญหา"
            register={register}
            className="w-72"
            textarea
          />
          {<ErrorMessage>{errors.detail?.message}</ErrorMessage>}
        </InputWrap>
        {/* เพิ่ม field รูปภาพ */}
        <Button type="submit" primary className="!mx-auto !mt-10">
          ส่งฟอร์ม
        </Button>
      </form>
    </div>
  );
};

export default NewIssuePage;
