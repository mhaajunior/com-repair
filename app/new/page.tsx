"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { createIssueSchema } from "@/types/validationSchemas";
import { SelectOption, SelectOptionWithTeam } from "@/types/selectOption";
import InputWrap from "@/components/inputGroup/InputWrap";
import Input from "@/components/inputGroup/Input";
import Dropdown from "@/components/inputGroup/Dropdown";
import Button from "@/components/Button";
import { errorHandler } from "@/helpers/errorHandler";
import Swal from "sweetalert2";

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<SelectOption[]>([]);
  const [groups, setGroups] = useState<SelectOptionWithTeam[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<SelectOption[]>([]);
  const [problems, setProblems] = useState<SelectOption[]>([]);
  const router = useRouter();
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });
  const teamId = watch("team");

  useEffect(() => {
    const getDropdownData = async () => {
      try {
        const { data } = await axios.get("/api/common");
        setTeams(data.teams);
        setGroups(data.groups);
        setProblems(data.problems);
      } catch (err: any) {
        errorHandler(err);
      }
    };

    getDropdownData();
  }, []);

  useEffect(() => {
    const getDropdownGroup = async () => {
      if (teamId) {
        setFilteredGroups(groups.filter((group) => group.teamId === teamId));
        setValue("group", 0);
      }
    };

    getDropdownGroup();
  }, [teamId, setValue, groups]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/issues", data);
      Swal.fire({
        title: `สร้างใบแจ้งซ่อมเลขที่ ${res.data.id} สำเร็จ`,
        text: "กรุณาจำหมายเลขใบแจ้งซ่อมของคุณเพื่อให้ง่ายต่อการค้นหาและติดตาม",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
      }).then(() => {
        router.push("/");
      });
    } catch (err: any) {
      errorHandler(err);
      setLoading(false);
    }
  });

  return (
    <>
      <h1 className="text-3xl">
        แบบฟอร์มการแจ้งซ่อมคอมพิวเตอร์ออนไลน์และอุปกรณ์ต่อพ่วง
      </h1>
      <form className="card flex flex-wrap" onSubmit={onSubmit}>
        <InputWrap label="ชื่อ" isValid={!errors.name} required>
          <Input
            name="name"
            placeholder="ชื่อ"
            register={register}
            errors={errors.name}
            className="w-60 md:w-72"
          />
        </InputWrap>
        <InputWrap label="นามสกุล" isValid={!errors.surname} required>
          <Input
            name="surname"
            placeholder="นามสกุล"
            register={register}
            errors={errors.surname}
            className="w-60 md:w-72"
          />
        </InputWrap>
        <InputWrap label="ศูนย์/สำนัก/กอง" isValid={!errors.team} required>
          <Dropdown
            name="team"
            placeholder="ศูนย์/สำนัก/กอง"
            options={teams}
            className="w-60 md:w-72"
            control={control}
            errors={errors.team}
          />
        </InputWrap>
        <InputWrap label="กลุ่มงาน" isValid={!errors.group} required>
          <Dropdown
            name="group"
            placeholder="กลุ่มงาน"
            options={filteredGroups}
            className="w-60 md:w-72"
            control={control}
            errors={errors.group}
          />
        </InputWrap>
        <InputWrap label="เบอร์โทรศัพท์" isValid={!errors.phone} required>
          <Input
            name="phone"
            placeholder="เบอร์โทรศัพท์"
            type="tel"
            pattern="\d*"
            maxlength="10"
            register={register}
            errors={errors.phone}
            className="w-60 md:w-72"
          />
        </InputWrap>
        <InputWrap label="ประเภทของปัญหา" isValid={!errors.problem} required>
          <Dropdown
            name="problem"
            placeholder="ประเภทของปัญหา"
            options={problems}
            className="w-60 md:w-72"
            control={control}
            errors={errors.problem}
          />
        </InputWrap>
        <InputWrap
          label="รายละเอียดอาการเสีย/ปัญหา"
          isValid={!errors.detail}
          required
        >
          <Input
            name="detail"
            placeholder="เขียนรายละเอียดอาการเสีย/ปัญหา"
            register={register}
            errors={errors.detail}
            className="w-60 md:w-72"
            textarea
          />
        </InputWrap>
        {/* เพิ่ม field รูปภาพ */}
        <div className="w-full">
          <Button
            type="submit"
            primary
            className="!mx-auto !mt-10"
            loading={loading}
          >
            ส่งฟอร์ม
          </Button>
        </div>
      </form>
    </>
  );
};

export default NewIssuePage;
