"use client";

import axios from "axios";
import Link from "next/link";
import { Modal, Spin, Switch, Table, Tag } from "antd";
import { ColumnsType, TableProps } from "antd/es/table";
import { FilterValue } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaPencilAlt,
  FaClipboardList,
  FaTrash,
  FaTrashRestore,
} from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import moment from "moment";
import { Role, Status } from "@prisma/client";
import Swal from "sweetalert2";
import { toast } from "sonner";

import { Issue, ObjectMap } from "@/types/issue";
import { editIssueSchema, searchIssueSchema } from "@/types/validationSchemas";
import { errorHandler } from "@/helpers/errorHandler";
import { ifNull } from "@/helpers/common";
import { statusMap } from "@/helpers/statusMap";
import { getQuarterDate } from "@/helpers/date";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Input from "@/components/inputGroup/Input";
import RangePicker from "@/components/inputGroup/RangePicker";
import useClientSession from "@/hooks/use-client-session";
import MyTooltip from "@/components/MyTooltip";
import { UserSelectOption } from "@/types/selectOption";

type SearchForm = z.infer<typeof searchIssueSchema>;
type EditForm = z.infer<typeof editIssueSchema>;

const ListPage = () => {
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [countIssues, setCountIssues] = useState<any>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [users, setUsers] = useState<UserSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showOnlyUser, setShowOnlyUser] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});

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

  const statusArr: { label: string; value: string; color: string }[] = [];
  const statusFilter: { text: string; value: string }[] = [];

  for (const [key, value] of Object.entries(statusMap)) {
    statusArr.push(value);
    statusFilter.push({ text: value.label, value: value.value });
  }

  const getIssuesList = async (data: SearchForm) => {
    try {
      const res = await axios.post("/api/issues/search", data, {
        headers: {
          "user-id": session?.user.id,
        },
      });
      if (res.status === 200) {
        setIssues(res.data.issues);
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
        const { data } = await axios.get("/api/common/user");

        const filteredUsers: UserSelectOption[] = [];

        for (let user of data) {
          filteredUsers.push({
            text: `${user.name} ${user.surname}`,
            value: `${user.name} ${user.surname}`,
          });
        }
        setUsers(filteredUsers);
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
    if (issues) {
      if (status) {
        setFilteredIssues(
          issues.filter((item) => item.status.value === status)
        );
      } else {
        setFilteredIssues(issues);
      }
    }
  }, [status, issues]);

  const handleViewClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setModalOpen(true);
  };

  const manageIssue = async (id: number, status: Status) => {
    const data: EditForm = { id, status };
    if (status === Status.ACKNOWLEDGE) {
      data.officerId = null;
      data.startDate = null;
      data.endDate = null;
      data.isCompleted = false;
      data.fixResult = null;
      data.note = null;
    }

    try {
      setLoading(true);
      await axios.patch("/api/issues", data, {
        headers: {
          "user-id": session?.user.id,
        },
      });
      getIssuesList({
        rangeDate: getValues("rangeDate"),
        id: getValues("id"),
        fullname: getValues("fullname"),
      });
    } catch (err: any) {
      errorHandler(err);
    }
  };

  const handleCancelClick = (issue: Issue) => {
    Swal.fire({
      title: "คำเตือน",
      text: `คุณต้องการยกเลิกใบแจ้งเลขที่ ${issue.id} ใช่หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ไม่",
      confirmButtonText: "ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        manageIssue(issue.id, Status.CANCELED);
        toast.success("ยกเลิกงานเรียบร้อย");
        setLoading(false);
      }
    });
  };

  const handleRestoreClick = (issue: Issue) => {
    Swal.fire({
      title: "คำเตือน",
      text: `คุณต้องการกู้คืนใบแจ้งเลขที่ ${issue.id} ใช่หรือไม่`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ไม่",
      confirmButtonText: "ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        manageIssue(issue.id, Status.ACKNOWLEDGE);
        toast.success("กู้คืนงานสำเร็จ");
        setLoading(false);
      }
    });
  };

  const columns: ColumnsType<Issue> = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      width: "7%",
      align: "center",
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      title: "เลขที่ใบแจ้ง",
      dataIndex: "id",
      key: "id",
      width: "8%",
      align: "center",
      sorter: (a, b) => a.id - b.id,
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
      filters: !showOnlyUser ? users : undefined,
      filteredValue: filteredInfo.officer || null,
      onFilter: (value: any, record: Issue) => record.officer === value,
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (obj: ObjectMap) => (
        <Tag color={obj.color} key={obj.value}>
          {obj.label}
        </Tag>
      ),
      filters: showOnlyUser ? statusFilter : undefined,
      filteredValue: filteredInfo.status || null,
      onFilter: (value: any, record: Issue) => record.status.value === value,
    },
    {
      title: "รายละเอียด",
      dataIndex: "",
      key: "x",
      fixed: "right",
      width: "9%",
      render: (value, record) => (
        <div className="flex gap-3 text-lg">
          <MyTooltip title="ดูข้อมูล">
            <div
              className="cursor-pointer hover:text-blue-300"
              onClick={() => handleViewClick(record)}
            >
              <FaClipboardList />
            </div>
          </MyTooltip>
          {(!record.isCompleted || session?.user.role === Role.ADMIN) &&
            record.status.value.toUpperCase() !== Status.CANCELED && (
              <MyTooltip title="แก้ไขงาน">
                <Link href={`/list/${record.id}`}>
                  <FaPencilAlt />
                </Link>
              </MyTooltip>
            )}
          {session?.user.role === "ADMIN" &&
            (record.status.value.toUpperCase() !== Status.CANCELED ? (
              <MyTooltip title="ยกเลิกงาน">
                <div
                  className="cursor-pointer hover:text-blue-300"
                  onClick={() => handleCancelClick(record)}
                >
                  <FaTrash />
                </div>
              </MyTooltip>
            ) : (
              <MyTooltip title="กู้คืนงาน">
                <div
                  className="cursor-pointer hover:text-blue-300"
                  onClick={() => handleRestoreClick(record)}
                >
                  <FaTrashRestore />
                </div>
              </MyTooltip>
            ))}
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
    setFilteredInfo(filters);
  };

  const onSwitchChange = (checked: boolean) => {
    if (issues) {
      if (checked) {
        setShowOnlyUser(true);
        setFilteredIssues(
          issues.filter((item) => item.officerId === session?.user.id)
        );
        setFilteredInfo({});
      } else {
        setShowOnlyUser(false);
        setFilteredIssues(issues);
        setStatus(null);
        setFilteredInfo({});
      }
    }
  };

  return (
    <>
      <h1 className="text-3xl">
        ตารางแสดงใบแจ้งซ่อมคอมพิวเตอร์ออนไลน์และอุปกรณ์ต่อพ่วง
      </h1>
      <div className="card">
        <form
          onSubmit={onSubmit}
          className="flex flex-wrap gap-x-5 gap-y-5 items-start mb-2 "
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
        <div className="flex mt-5 gap-5 items-center">
          <p>แสดงเฉพาะงานตัวเอง</p>
          <Switch onChange={onSwitchChange} className="bg-gray-500" />
        </div>
        <div className="mt-10">
          {!issues ? (
            <Spin size="large" className="flex justify-center" />
          ) : (
            <div>
              {!showOnlyUser && (
                <div className="flex flex-wrap">
                  <Badge
                    key="all"
                    color="Black"
                    onClick={() => setStatus(null)}
                    active={!status}
                    count={countIssues["ALL"]}
                  >
                    <MyTooltip title="ทั้งหมด">
                      <span>ทั้งหมด</span>
                    </MyTooltip>
                  </Badge>
                  {statusArr.map((item) => (
                    <Badge
                      key={item.value}
                      color={item.color}
                      onClick={() => setStatus(item.value)}
                      active={item.value === status}
                      count={countIssues[item.value.toUpperCase()]}
                    >
                      <MyTooltip title={item.label}>
                        <span>{item.label}</span>
                      </MyTooltip>
                    </Badge>
                  ))}
                </div>
              )}
              <Table
                columns={columns}
                dataSource={filteredIssues}
                onChange={onChange}
                scroll={{ x: 1500 }}
                showSorterTooltip={false}
                pagination={{
                  defaultPageSize: 100,
                }}
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
        <div className="text-gray-600 text-base leading-7">
          <p className="flex">
            <span className="w-2/6">เลขที่ใบแจ้ง</span>
            <span className="w-4/6">{selectedIssue?.id}</span>
          </p>
          <hr className="my-1" />
          <p className="flex py-2">
            <span className="w-2/6">วันเวลาที่แจ้ง</span>
            <span className="w-4/6">{selectedIssue?.createdAt}</span>
          </p>
          <hr className="my-1" />
          <p className="flex">
            <span className="w-2/6">ผู้แจ้ง</span>
            <span className="w-4/6">{selectedIssue?.sender}</span>
          </p>
          <hr className="my-1" />
          <p className="flex">
            <span className="w-2/6">หน่วยงาน</span>
            <span className="w-4/6">{selectedIssue?.workGroup}</span>
          </p>
          <hr className="my-1" />
          <p className="flex">
            <span className="w-2/6">เบอร์โทร</span>
            <span className="w-4/6">{selectedIssue?.phone}</span>
          </p>
          <hr className="my-1" />
          <p className="flex">
            <span className="w-2/6">ประเภทของปัญหา</span>
            <span className="w-4/6">{selectedIssue?.problem}</span>
          </p>
          <hr className="my-1" />
          <p className="flex">
            <span className="w-2/6">อาการเสีย/ปัญหา</span>
            <span className="w-4/6">{selectedIssue?.detail}</span>
          </p>
          <hr className="my-1" />
          <p className="flex">
            <span className="w-2/6">สถานะงาน</span>
            <span>
              <Tag
                color={selectedIssue?.status.color}
                key={selectedIssue?.status.value}
              >
                {selectedIssue?.status.label}
              </Tag>
            </span>
          </p>
          <hr className="my-1" />
          <p className="flex">
            <span className="w-2/6">ผู้รับงาน</span>
            <span className="w-4/6">{ifNull(selectedIssue?.officer)}</span>
          </p>
          <hr className="my-1" />
          <p className="flex">
            <span className="w-2/6">ระยะเวลาซ่อม</span>
            <span className="w-4/6">{ifNull(selectedIssue?.duration)}</span>
          </p>
          <hr className="my-1" />
          <p className="flex">
            <span className="w-2/6">สรุปผลการซ่อม</span>
            <span className="w-4/6">{ifNull(selectedIssue?.fixResult)}</span>
          </p>
          <hr className="my-1" />
          <p className="flex">
            <span className="w-2/6">หมายเหตุ/อื่นๆ</span>
            <span className="w-4/6">{ifNull(selectedIssue?.note)}</span>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default ListPage;
