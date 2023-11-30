"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Spin, Tag } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { Status } from "@prisma/client";
import { toast } from "sonner";
import { z } from "zod";

import Button from "@/components/Button";
import Dropdown from "@/components/inputGroup/Dropdown";
import Input from "@/components/inputGroup/Input";
import InputWrap from "@/components/inputGroup/InputWrap";
import { ifNull } from "@/helpers/common";
import { errorHandler } from "@/helpers/errorHandler";
import { statusMap } from "@/helpers/statusMap";
import useClientSession from "@/hooks/use-client-session";
import { Issue } from "@/types/issue";
import { SelectOption } from "@/types/selectOption";
import { editIssueSchema } from "@/types/validationSchemas";

type EditForm = z.infer<typeof editIssueSchema>;

const EditPage = () => {
  const [loading, setLoading] = useState(false);
  const [fixResultError, setFixResultError] = useState<{
    message: string;
  } | null>(null);
  const [issue, setIssue] = useState<Issue | null>(null);
  const params = useParams();
  const session = useClientSession();
  const router = useRouter();
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<EditForm>({
    resolver: zodResolver(editIssueSchema),
  });
  const status: Status = watch("status");
  let statusOption: SelectOption[] = [];

  for (const [key, value] of Object.entries(statusMap)) {
    statusOption.push({ value: key, label: value.label });
  }

  switch (issue?.status.value.toUpperCase()) {
    case Status.OPEN:
      statusOption = statusOption.filter(
        (item) =>
          item.value === Status.ACKNOWLEDGE || item.value === Status.IN_PROGRESS
      );
      break;
    case Status.ACKNOWLEDGE:
      statusOption = statusOption.filter(
        (item) => item.value === Status.IN_PROGRESS
      );
      break;
    case Status.IN_PROGRESS:
      statusOption = statusOption.filter(
        (item) =>
          item.value !== Status.OPEN &&
          item.value !== Status.CANCELED &&
          item.value !== Status.IN_PROGRESS
      );
      break;
    default:
      statusOption = [];
  }

  useEffect(() => {
    setFixResultError(null);
  }, [status]);

  useEffect(() => {
    const getIssue = async () => {
      try {
        const res = await axios.post(
          "/api/issues/search",
          { id: parseInt(params.id as string) },
          {
            headers: {
              "user-id": session?.user.id,
            },
          }
        );
        if (res.status === 200) {
          setIssue(res.data.issues[0]);
          setValue("id", res.data.issues[0].id);
        }
      } catch (err: any) {
        errorHandler(err);
        setLoading(false);
      }
    };

    if (session) {
      setLoading(true);
      getIssue();
      setLoading(false);
    }
  }, [session]);

  const onSubmit = handleSubmit(async (data) => {
    if (
      (status === Status.CLOSED ||
        status === Status.NOTIFY ||
        status === Status.CANT_FIX) &&
      !data.fixResult
    ) {
      setFixResultError({ message: "กรุณากรอกสรุปผลการซ่อม" });
      return;
    }

    if (status === Status.IN_PROGRESS) {
      data.officerId = session?.user.id;
      data.startDate = new Date().toISOString();
    } else if (
      status === Status.CLOSED ||
      status === Status.NOTIFY ||
      status === Status.CANT_FIX
    ) {
      data.endDate = new Date().toISOString();
    }

    try {
      setLoading(true);
      await axios.patch("/api/issues", data, {
        headers: {
          "user-id": session?.user.id,
        },
      });
      toast.success("อัพเดตไบแจ้งซ่อมเรียบร้อย");
      router.push("/list");
    } catch (err: any) {
      errorHandler(err);
      setLoading(false);
    }
  });

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">แก้ไขใบแจ้งซ่อม</h1>
        <Button
          secondary
          className="!shadow-none"
          onClick={() => router.push("/list")}
        >
          กลับ
        </Button>
      </div>
      <div className="card">
        {loading ? (
          <Spin size="large" className="flex justify-center" />
        ) : (
          <>
            <div className="!leading-10 text-lg">
              <h1 className="font-bold text-xl">รายละเอียด</h1>
              <hr className="my-3" />
              <p className="flex">
                <span className="w-2/6">เลขที่ใบแจ้ง</span>
                <span className="w-4/6">{issue?.id}</span>
              </p>
              <p className="flex">
                <span className="w-2/6">วันเวลาที่แจ้ง</span>
                <span className="w-4/6">{issue?.createdAt}</span>
              </p>
              <p className="flex">
                <span className="w-2/6">ผู้แจ้ง</span>
                <span className="w-4/6">{issue?.sender}</span>
              </p>
              <p className="flex">
                <span className="w-2/6">หน่วยงาน</span>
                <span className="w-4/6">{issue?.workGroup}</span>
              </p>
              <p className="flex">
                <span className="w-2/6">เบอร์โทร</span>
                <span className="w-4/6">{issue?.phone}</span>
              </p>
              <p className="flex">
                <span className="w-2/6">ประเภทของปัญหา</span>
                <span className="w-4/6">{issue?.problem}</span>
              </p>
              <p className="flex">
                <span className="w-2/6">อาการเสีย/ปัญหา</span>
                <span className="w-4/6">{issue?.detail}</span>
              </p>
              <p className="flex">
                <span className="w-2/6">สถานะงานเดิม</span>
                <span>
                  <Tag color={issue?.status.color} key={issue?.status.value}>
                    {issue?.status.label}
                  </Tag>
                </span>
              </p>
              <p className="flex">
                <span className="w-2/6">ผู้รับงาน</span>
                <span className="w-4/6">{ifNull(issue?.officer)}</span>
              </p>
              <p className="flex">
                <span className="w-2/6">ระยะเวลาซ่อม</span>
                <span className="w-4/6">{ifNull(issue?.duration)}</span>
              </p>
              <p className="flex">
                <span className="w-2/6">สรุปผลการซ่อม</span>
                <span className="w-4/6">{ifNull(issue?.fixResult)}</span>
              </p>
              <p className="flex">
                <span className="w-2/6">หมายเหตุ/อื่นๆ</span>
                <span className="w-4/6">{ifNull(issue?.note)}</span>
              </p>
            </div>
            <hr className="my-3" />
            <div>
              <h1 className="font-bold text-xl">แก้ไขงาน</h1>
              <hr className="my-3" />
              <form className="flex flex-wrap" onSubmit={onSubmit}>
                <InputWrap
                  label="เปลี่ยนสถานะงาน"
                  isValid={!errors.status}
                  required
                  className="pl-0"
                  alignStart
                >
                  <Dropdown
                    name="status"
                    placeholder="สถานะงาน"
                    options={statusOption}
                    className="w-60 md:w-72"
                    control={control}
                    errors={errors.status}
                  />
                </InputWrap>

                {(status === Status.CANT_FIX ||
                  status === Status.NOTIFY ||
                  status === Status.CLOSED) && (
                  <>
                    <InputWrap
                      label="สรุปผลการซ่อม"
                      isValid={!fixResultError}
                      required
                      className="pl-0"
                      alignStart
                    >
                      <Input
                        name="fixResult"
                        placeholder="สรุปผลการซ่อม"
                        register={register}
                        errors={fixResultError}
                        className="w-60 md:w-72"
                        textarea
                      />
                    </InputWrap>
                    <InputWrap
                      label="หมายเหตุ/อื่นๆ"
                      isValid={!errors.note}
                      className="pl-0"
                      alignStart
                    >
                      <Input
                        name="note"
                        placeholder="หมายเหตุ/อื่นๆ"
                        register={register}
                        errors={errors.note}
                        className="w-60 md:w-72"
                        textarea
                      />
                    </InputWrap>
                  </>
                )}
                <div className="w-full">
                  <Button
                    type="submit"
                    primary
                    className="!mx-auto !mt-10"
                    loading={loading}
                  >
                    บันทึก
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EditPage;
