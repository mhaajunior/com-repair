"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { createIssueSchema } from "@/types/validationSchemas";
import { SelectOption, SelectOptionWithTeam } from "@/types/inputProps";
import InputWrap from "@/components/inputGroup/InputWrap";
import Input from "@/components/inputGroup/Input";
import Dropdown from "@/components/inputGroup/Dropdown";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import { errorHandler } from "@/helpers/errorHandler";

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
      await axios.post("/api/issues", data);
      toast.success("สร้างฟอร์มแจ้งซ่อมสำเร็จ");
      router.push("/");
    } catch (err: any) {
      errorHandler(err);
      setLoading(false);
    }
  });

  return (
    <div className="sm:px-16 md:px-24 px-8 py-5">
      <h1 className="text-3xl">
        แบบฟอร์มการแจ้งซ่อมคอมพิวเตอร์ออนไลน์และอุปกรณ์ต่อพ่วง
      </h1>
      <form className="card flex flex-wrap" onSubmit={onSubmit}>
        <InputWrap label="ชื่อ" isValid={!errors.name} required>
          <Input
            name="name"
            placeholder="ชื่อ"
            register={register}
            className="w-60 md:w-72"
          />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </InputWrap>
        <InputWrap label="นามสกุล" isValid={!errors.surname} required>
          <Input
            name="surname"
            placeholder="นามสกุล"
            register={register}
            className="w-60 md:w-72"
          />
          <ErrorMessage>{errors.surname?.message}</ErrorMessage>
        </InputWrap>
        <InputWrap label="ศูนย์/สำนัก/กอง" isValid={!errors.team} required>
          <Dropdown
            name="team"
            placeholder="ศูนย์/สำนัก/กอง"
            options={teams}
            className="w-60 md:w-72"
            control={control}
          />
          <ErrorMessage>{errors.team?.message}</ErrorMessage>
        </InputWrap>
        <InputWrap label="กลุ่มงาน" isValid={!errors.group} required>
          <Dropdown
            name="group"
            placeholder="กลุ่มงาน"
            options={filteredGroups}
            className="w-60 md:w-72"
            control={control}
          />
          <ErrorMessage>{errors.group?.message}</ErrorMessage>
        </InputWrap>
        <InputWrap label="เบอร์โทรศัพท์" isValid={!errors.phone} required>
          <Input
            name="phone"
            placeholder="เบอร์โทรศัพท์"
            type="tel"
            pattern="\d*"
            maxlength="10"
            register={register}
            className="w-60 md:w-72"
          />
          <ErrorMessage>{errors.phone?.message}</ErrorMessage>
        </InputWrap>
        <InputWrap label="ประเภทของปัญหา" isValid={!errors.problem} required>
          <Dropdown
            name="problem"
            placeholder="ประเภทของปัญหา"
            options={problems}
            className="w-60 md:w-72"
            control={control}
          />
          <ErrorMessage>{errors.problem?.message}</ErrorMessage>
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
            className="w-60 md:w-72"
            textarea
          />
          <ErrorMessage>{errors.detail?.message}</ErrorMessage>
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
    </div>
  );
};

export default NewIssuePage;
