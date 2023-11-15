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
    <div className="sm:px-16 md:px-24 px-8 py-5">
      <h1 className="text-3xl">
        ค้นหาใบแจ้งซ่อมคอมพิวเตอร์ออนไลน์และอุปกรณ์ต่อพ่วง
      </h1>
      <form
        className="card flex flex-wrap gap-x-5 items-center"
        onSubmit={onSubmit}
      >
        <div className="w-full">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
        <div className="relative">
          <Input
            name="id"
            placeholder="หมายเลขใบแจ้ง"
            register={register}
            className="w-60 md:w-72 h-[40px]"
          />
          <span className="absolute left-0 top-10">
            <ErrorMessage>{errors.id?.message}</ErrorMessage>
          </span>
        </div>
        <div className="relative">
          <Input
            name="fullname"
            placeholder="ชื่อ นามสกุล"
            register={register}
            className="w-60 md:w-72 h-[40px]"
          />
          <span className="absolute left-0 top-10">
            <ErrorMessage>{errors.fullname?.message}</ErrorMessage>
          </span>
        </div>
        <Button type="submit" primary loading={loading}>
          <AiOutlineSearch />
        </Button>
      </form>
      {isSubmitSuccessful &&
        (response.length > 0 ? (
          <Table columns={columns} dataSource={response} scroll={{ x: 1500 }} />
        ) : (
          <Empty />
        ))}
    </div>
  );
};

export default SearchIssuePage;
