"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineSearch } from "react-icons/ai";
import { Empty, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import Input from "@/components/inputGroup/Input";
import Button from "@/components/Button";
import { searchIssueSchema } from "@/types/validationSchemas";
import ErrorMessage from "@/components/ErrorMessage";
import { errorHandler } from "@/helpers/errorHandler";
import { IssueType } from "@/types/outputProps";

const columns: ColumnsType<IssueType> = [
  {
    title: "เลขที่ใบแจ้ง",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "ผู้แจ้ง",
    dataIndex: "fullname",
    key: "fullname",
  },
  {
    title: "กลุ่มงาน",
    dataIndex: "group",
    key: "group",
  },
  {
    title: "วันที่แจ้ง",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "ประเภทของปัญหา",
    dataIndex: "problem",
    key: "problem",
  },
  {
    title: "อาการเสีย/ปัญหา",
    dataIndex: "detail",
    key: "detail",
  },
  {
    title: "Tags",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "ผู้รับงาน",
    dataIndex: "officer",
    key: "officer",
  },
  {
    title: "สรุปผลการซ่อม",
    dataIndex: "fixResult",
    key: "fixResult",
  },
];

type SearchForm = z.infer<typeof searchIssueSchema>;

const SearchIssuePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<IssueType[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchIssueSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const fullname = data.fullname?.trim();
    try {
      if (!data.id && !fullname) {
        setError("กรุณากรอกข้อมูลที่จะค้นหาอย่างน้อย 1 ช่อง");
        return;
      }
      setLoading(true);
      setError("");
      const res = await axios.post("/api/issues/search", data);

      if (res.status === 200) {
        setResponse(res.data);
      }
      setLoading(false);
    } catch (err: any) {
      errorHandler(err);
      setLoading(false);
    }
  });

  return (
    <>
      <h1 className="text-3xl">
        ค้นหาใบแจ้งซ่อมคอมพิวเตอร์ออนไลน์และอุปกรณ์ต่อพ่วง
      </h1>
      <div className="card ">
        <form
          onSubmit={onSubmit}
          className="flex flex-wrap gap-x-5 gap-y-5 items-start mb-2"
        >
          <Input
            name="id"
            placeholder="หมายเลขใบแจ้ง"
            register={register}
            errors={errors.id}
            className="w-60 md:w-72"
          />
          <Input
            name="fullname"
            placeholder="ชื่อ นามสกุล"
            register={register}
            errors={errors.fullname}
            className="w-60 md:w-72"
          />
          <Button
            type="submit"
            primary
            loading={loading}
            className="!m-0 h-[45px]"
          >
            <AiOutlineSearch />
          </Button>
        </form>
        {isSubmitSuccessful &&
          (response.length > 0 ? (
            <>
              <hr className="mb-5" />
              <h1 className="text-lg">ตารางการแจ้งซ่อม</h1>
              <Table
                columns={columns}
                dataSource={response}
                scroll={{ x: 1500 }}
              />
            </>
          ) : (
            <>
              <hr className="mb-5" />
              <Empty />
            </>
          ))}
      </div>
    </>
  );
};

export default SearchIssuePage;
