"use client";

import axios from "axios";
import Link from "next/link";
import { Modal, Spin, Table, Tag, Tooltip } from "antd";
import { ColumnsType, TableProps } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPencilAlt, FaClipboardList, FaTrash } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import useClientSession from "@/hooks/use-client-session";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import moment from "moment";

import { Issue, StatusMap } from "@/types/issue";
import { searchIssueSchema } from "@/types/validationSchemas";
import { errorHandler } from "@/helpers/errorHandler";
import { ifNull } from "@/helpers/common";
import { statusMap } from "@/helpers/statusMap";
import { getQuarterDate } from "@/helpers/date";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Input from "@/components/inputGroup/Input";
import RangePicker from "@/components/inputGroup/RangePicker";

type SearchForm = z.infer<typeof searchIssueSchema>;

const ListPage = () => {
  const [response, setResponse] = useState<Issue[]>([]);
  const [filteredRow, setFilteredRow] = useState<Issue[]>([]);
  const [countIssues, setCountIssues] = useState<any>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const session = useClientSession();

  const dateFormat = "DD/MM/YYYY";
  const dateObj = getQuarterDate();
  const startDate = moment(dateObj.startDate, "YYYY-MM-DD").format(dateFormat);
  const endDate = moment(dateObj.endDate, "YYYY-MM-DD").format(dateFormat);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchIssueSchema),
    defaultValues: {
      rangeDate: [dayjs(startDate, dateFormat), dayjs(endDate, dateFormat)],
    },
  });
  const statusArr = [];

  for (const [key, value] of Object.entries(statusMap)) {
    statusArr.push(value);
  }

  const getIssuesList = async (data: SearchForm) => {
    try {
      const res = await axios.post("/api/issues/search", data, {
        headers: {
          "user-id": session?.user.id,
        },
      });
      if (res.status === 200) {
        setResponse(res.data.issues);
        setCountIssues(res.data.countIssues);
      }
    } catch (err: any) {
      errorHandler(err);
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    getIssuesList(data);
    setLoading(false);
  });

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("/api/common/user");
        if (res.status === 200) {
          setUsers(res.data);
        }
      } catch (err: any) {
        errorHandler(err);
      }
    };

    if (session) {
      setLoading(true);
      getUsers();
      getIssuesList({ rangeDate: getValues("rangeDate") });
      setLoading(false);
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

  const handleViewClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setModalOpen(true);
  };

  const columns: ColumnsType<Issue> = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      width: "8%",
      sorter: (a, b) => a.key - b.key,
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
          <div
            className="cursor-pointer hover:text-blue-300"
            onClick={() => handleViewClick(record)}
          >
            <FaClipboardList />
          </div>
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
          <RangePicker
            name="rangeDate"
            placeholder={["เริ่มวันที่", "ถึงวันที่"]}
            errors={errors.rangeDate}
            control={control}
            className="w-60 md:w-72"
            defaultVal={[startDate, endDate]}
          />
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
                  color="Black"
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
                columns={columns}
                dataSource={filteredRow}
                onChange={onChange}
                scroll={{ x: 1500 }}
                className="relative"
                showSorterTooltip={false}
              />
            </div>
          )}
        </div>
      </div>
      <Modal
        title="รายละเอียดการให้บริการแจ้งซ่อม"
        centered
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="text-gray-600 text-base leading-9">
          <p className="flex">
            <span className="w-2/6">เลขที่ใบแจ้ง</span>
            {selectedIssue?.id}
          </p>
          <p className="flex">
            <span className="w-2/6">วันเวลาที่แจ้ง</span>
            {selectedIssue?.createdAt}
          </p>
          <hr />
          <p className="flex">
            <span className="w-2/6">ผู้แจ้ง</span>
            {selectedIssue?.sender}
          </p>
          <hr />
          <p className="flex">
            <span className="w-2/6">หน่วยงาน</span>
            {selectedIssue?.workGroup}
          </p>
          <hr />
          <p className="flex">
            <span className="w-2/6">เบอร์โทร</span>
            {selectedIssue?.phone}
          </p>
          <hr />
          <p className="flex">
            <span className="w-2/6">ประเภทของปัญหา</span>
            {selectedIssue?.problem}
          </p>
          <hr />
          <p className="flex">
            <span className="w-2/6">อาการเสีย/ปัญหา</span>

            {selectedIssue?.detail}
          </p>
          <hr />
          <p className="flex">
            <span className="w-2/6">สถานะงาน</span>
            {selectedIssue?.status.label}
          </p>
          <hr />
          <p className="flex">
            <span className="w-2/6">ผู้รับงาน</span>
            {ifNull(selectedIssue?.officer)}
          </p>
          <hr />
          <p className="flex">
            <span className="w-2/6">ระยะเวลาซ่อม</span>-
          </p>
          <hr />
          <p className="flex">
            <span className="w-2/6">สรุปผลการซ่อม</span>
            {ifNull(selectedIssue?.fixResult)}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default ListPage;
