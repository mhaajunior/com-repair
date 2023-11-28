"use client";

import { Issue, StatusMap } from "@/types/issue";
import { Spin, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { errorHandler } from "@/helpers/errorHandler";
import useClientSession from "@/hooks/use-client-session";
import { ifNull } from "@/helpers/common";
import { ColumnsType, TableProps } from "antd/es/table";
import { statusMap } from "@/helpers/statusMap";
import { FaPencilAlt, FaClipboardList, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/inputGroup/Input";
import { AiOutlineSearch } from "react-icons/ai";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { searchIssueSchema } from "@/types/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type SearchForm = z.infer<typeof searchIssueSchema>;

const ListPage = () => {
  const [response, setResponse] = useState<Issue[]>([]);
  const [filteredRow, setFilteredRow] = useState<Issue[]>([]);
  const [countIssues, setCountIssues] = useState<any>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const session = useClientSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchIssueSchema),
  });
  const statusArr = [];

  for (const [key, value] of Object.entries(statusMap)) {
    statusArr.push(value);
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/issues/search", data, {
        headers: {
          "user-id": session?.user.id,
        },
      });

      if (res.status === 200) {
        setResponse(res.data);
      }
      setLoading(false);
    } catch (err: any) {
      errorHandler(err);
      setLoading(false);
    }
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.post(
          "/api/issues/search",
          {},
          {
            headers: {
              "user-id": session?.user.id,
            },
          }
        );
        if (res.status === 200) {
          setResponse(res.data);
        }

        const countIssues = await axios.get("/api/issues");
        if (res.status === 200) {
          setCountIssues(countIssues.data);
        }

        const users = await axios.get("/api/common/user");
        if (res.status === 200) {
          setUsers(users.data);
        }

        setLoading(false);
      } catch (err: any) {
        errorHandler(err);
        setLoading(false);
      }
    };

    if (session) {
      setLoading(true);
      getData();
    }
  }, [session]);

  useEffect(() => {
    if (status) {
      setFilteredRow(response.filter((item) => item.status.value === status));
    } else {
      setFilteredRow(response);
    }
  }, [status, response]);

  const filters: { text: string; value: string }[] = [];
  for (const [key, value] of Object.entries(statusMap)) {
    filters.push({ text: value.label, value: value.value });
  }

  const columns: ColumnsType<Issue> = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      width: "8%",
    },
    {
      title: "เลขที่ใบแจ้ง",
      dataIndex: "id",
      key: "id",
      width: "8%",
    },
    {
      title: "ผู้แจ้ง",
      dataIndex: "sender",
      key: "sender",
    },
    {
      title: "กลุ่มงาน",
      dataIndex: "workGroup",
      key: "workGroup",
      width: "20%",
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
      title: "ผู้รับงาน",
      dataIndex: "officer",
      key: "officer",
      render: (str) => ifNull(str),
      filters: users,
      filterSearch: true,
      onFilter: (value: any, record: Issue) => record.officer === value,
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (obj: StatusMap) => (
        <Tag color={obj.color} key={obj.value}>
          {obj.label}
        </Tag>
      ),
    },
    {
      title: "รายละเอียด",
      dataIndex: "",
      key: "x",
      fixed: "right",
      width: "9%",
      render: (value, record) => (
        <div className="flex gap-4 text-lg">
          <FaClipboardList />
          <Link href={`/edit/${record.id}`}>
            <FaPencilAlt />
          </Link>
          {session?.user.role === "ADMIN" && <FaTrash />}
        </div>
      ),
    },
  ];

  const onChange: TableProps<Issue>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    // console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <>
      <h1 className="text-3xl">
        ตารางแสดงใบแจ้งซ่อมคอมพิวเตอร์ออนไลน์และอุปกรณ์ต่อพ่วง
      </h1>
      <div className="card">
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
        <div className="mt-10 relative">
          <Spin size="large" className="center" />
          {loading ? (
            <Spin size="large" className="center" />
          ) : (
            <div>
              <div className="flex flex-wrap">
                <Badge
                  key="all"
                  color="burlyWood"
                  onClick={() => setStatus(null)}
                  active={!status}
                  count={countIssues["ALL"]}
                >
                  <Tooltip title="ทั้งหมด">
                    <span>ทั้งหมด</span>
                  </Tooltip>
                </Badge>
                {statusArr.map((item) => (
                  <Badge
                    key={item.value}
                    color={item.color}
                    onClick={() => setStatus(item.value)}
                    active={item.value === status}
                    count={countIssues[item.value.toUpperCase()]}
                  >
                    <Tooltip title={item.label}>
                      <span>{item.label}</span>
                    </Tooltip>
                  </Badge>
                ))}
              </div>
              <Table
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      router.push(`/edit/${record.id}`);
                    },
                  };
                }}
                rowClassName="cursor-pointer"
                columns={columns}
                dataSource={filteredRow}
                onChange={onChange}
                scroll={{ x: 1500 }}
                className="relative"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ListPage;
