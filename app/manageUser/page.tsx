"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Spin, Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  FaAngleDown,
  FaAngleUp,
  FaIdCard,
  FaPencilAlt,
  FaTrash,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";

import { ObjectMap } from "@/types/issue";
import { UserProps } from "@/types/outputProps";
import { createUserSchema, editUserSchema } from "@/types/validationSchemas";
import { errorHandler } from "@/helpers/errorHandler";
import useClientSession from "@/hooks/use-client-session";
import MyTooltip from "@/components/MyTooltip";
import Input from "@/components/inputGroup/Input";
import Button from "@/components/Button";

type CreateForm = z.infer<typeof createUserSchema>;
type EditForm = z.infer<typeof editUserSchema>;

const ManageUserPage = () => {
  const [users, setUsers] = useState<UserProps[] | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [createModalopen, setCreateModalOpen] = useState(false);
  const [editModalopen, setEditModalOpen] = useState(false);
  const [actionsModalopen, setActionsModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [pwVisible, setPwVisible] = useState(false);
  const [confPwVisible, setConfPwVisible] = useState(false);
  const session = useClientSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm<CreateForm>({
    resolver: zodResolver(createUserSchema),
  });
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    setValue: setValue2,
    formState: { errors: errors2 },
    clearErrors: clearErrors2,
  } = useForm<EditForm>({
    resolver: zodResolver(editUserSchema),
  });
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    reset: reset3,
    formState: { errors: errors3 },
  } = useForm();

  const getUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/common/user");
      setUsers(data);
    } catch (err: any) {
      errorHandler(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (!showEditPassword) {
      setValue2("password", "");
      setValue2("confPassword", "");
    }
  }, [showEditPassword]);

  const columns: ColumnsType<UserProps> = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      width: "7%",
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
      width: "13%",
    },
    {
      title: "นามสกุล",
      dataIndex: "surname",
      key: "surname",
      width: "13%",
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "ตำแหน่ง",
      dataIndex: "role",
      key: "role",
      render: (obj: ObjectMap) => (
        <Tag color={obj.color} key={obj.value}>
          {obj.label}
        </Tag>
      ),
      width: "13%",
    },
    {
      title: "รายละเอียด",
      dataIndex: "",
      key: "x",
      fixed: "right",
      width: "11%",
      render: (value, record) => (
        <div className="flex gap-3 text-lg">
          {session?.user.id === record.id ? (
            <p className="text-sm text-gray-800 font-bold">รหัสตนเอง</p>
          ) : (
            <div className="flex gap-3 text-lg">
              <MyTooltip title="แก้ไขผู้ใช้">
                <div
                  className="cursor-pointer hover:text-blue-300"
                  onClick={() => handleEditClick(record)}
                >
                  <FaPencilAlt />
                </div>
              </MyTooltip>
              <MyTooltip title="ปรับสิทธิ">
                <div
                  className="cursor-pointer hover:text-blue-300"
                  onClick={() => handleActionClick(record, "promotion")}
                >
                  <FaIdCard />
                </div>
              </MyTooltip>
              <MyTooltip title="ลบผู้ใช้">
                <div
                  className="cursor-pointer hover:text-blue-300"
                  onClick={() => handleActionClick(record, "delete")}
                >
                  <FaTrash />
                </div>
              </MyTooltip>
            </div>
          )}
        </div>
      ),
    },
  ];

  // create
  const onCreateSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/common/user", data, {
        headers: {
          "user-id": session?.user.id,
        },
      });
      if (res.status === 201) {
        toast.success("สร้างผู้ใช้งานสำเร็จ");
        getUsers();
      }
    } catch (err: any) {
      errorHandler(err);
    }
    setLoading(false);
    reset();
    onCancelCreate();
  });

  const onCancelCreate = () => {
    setCreateModalOpen(false);
    clearErrors();
  };

  const handleCreateClick = () => {
    setCreateModalOpen(true);
    setEditModalOpen(false);
    setActionsModalOpen(false);
    setPwVisible(false);
  };

  // edit
  const onCancelEdit = () => {
    setEditModalOpen(false);
    setShowEditPassword(false);
    clearErrors2();
  };

  const onEditSubmit = handleSubmit2(async (data) => {
    if (data.password && data.password !== data.confPassword) {
      setPasswordError("กรุณากรอกรหัสผ่านให้ตรงกัน");
      return;
    }
    if (!data.password) {
      delete data.password;
    }
    delete data.confPassword;

    if (selectedId) {
      try {
        setLoading(true);
        const res = await axios.put(`/api/common/user/${selectedId}`, data, {
          headers: {
            "user-id": session?.user.id,
          },
        });
        if (res.status === 200) {
          toast.success("แก้ไขผู้ใช้งานสำเร็จ");
          getUsers();
        }
      } catch (err: any) {
        errorHandler(err);
      }
    }
    setLoading(false);
    reset2();
    onCancelEdit();
  });

  const handleEditClick = (record: UserProps) => {
    setEditModalOpen(true);
    setCreateModalOpen(false);
    setActionsModalOpen(false);
    setSelectedId(record.id);
    setValue2("email", record.email);
    setValue2("name", record.name);
    setValue2("surname", record.surname);
    setValue2("password", "");
    setValue2("confPassword", "");
    setPasswordError(null);
    setPwVisible(false);
    setConfPwVisible(false);
  };

  // promote or cancel
  const onActionSubmit = handleSubmit3(async (data) => {
    if (!data.actionEmail) {
      setEmailError("กรุณากรอกอีเมล");
      return;
    }

    if (data.actionEmail && data.actionEmail !== selectedUser?.email) {
      setEmailError("อีเมลที่กรอกไม่ถูกต้อง");
      return;
    }

    if (actionMode === "promotion") {
      promoteUser();
    } else if (actionMode === "delete") {
      deleteUser();
    }
    setEmailError(null);
  });

  const onCancelAction = () => {
    setActionsModalOpen(false);
    reset3();
    setEmailError(null);
  };

  const handleActionClick = (record: UserProps, mode: string) => {
    setActionsModalOpen(true);
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setSelectedUser(record);
    setActionMode(mode);
  };

  const deleteUser = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(`/api/common/user/${selectedUser?.id}`, {
        headers: {
          "user-id": session?.user.id,
        },
      });
      if (res.status === 200) {
        toast.success("ลบผู้ใช้งานสำเร็จ");
        getUsers();
      }
    } catch (err: any) {
      errorHandler(err);
    }
    setLoading(false);
    onCancelAction();
  };

  const promoteUser = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `/api/common/user/${selectedUser?.id}`,
        {},
        {
          headers: {
            "user-id": session?.user.id,
          },
        }
      );
      if (res.status === 200) {
        toast.success("ปรับสิทธิผู้ใช้งานสำเร็จ");
        getUsers();
      }
    } catch (err: any) {
      errorHandler(err);
    }
    setLoading(false);
    onCancelAction();
  };

  let actionText = "";
  if (actionMode === "promotion") {
    actionText = "เปลี่ยนสิทธิ";
  } else {
    actionText = "ลบ";
  }

  return (
    <>
      <h1 className="text-3xl">จัดการผู้ใช้งาน</h1>
      <div className="card">
        <div className="flex justify-end mb-2">
          <p
            className="flex items-center gap-1 cursor-pointer hover:text-black"
            onClick={handleCreateClick}
          >
            <IoIosAddCircle className="text-xl" />
            เพิ่มผู้ใช้
          </p>
        </div>
        {!users ? (
          <Spin size="large" className="flex justify-center" />
        ) : (
          <Table columns={columns} dataSource={users} scroll={{ x: 1000 }} />
        )}
      </div>
      <Modal
        title={<p className="text-center text-xl">ฟอร์มสร้างผู้ใช้งาน</p>}
        open={createModalopen}
        onCancel={onCancelCreate}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <form
          onSubmit={onCreateSubmit}
          className="flex flex-wrap gap-x-5 gap-y-5 justify-center mt-10"
        >
          <Input
            name="email"
            type="email"
            placeholder="อีเมล"
            register={register}
            errors={errors.email}
            className="w-60 md:w-72"
          />
          <Input
            name="name"
            placeholder="ชื่อ"
            register={register}
            errors={errors.name}
            className="w-60 md:w-72"
          />
          <Input
            name="surname"
            placeholder="นามสกุล"
            register={register}
            errors={errors.surname}
            className="w-60 md:w-72"
          />
          <Input
            name="password"
            type={pwVisible ? "text" : "password"}
            placeholder="รหัสผ่าน"
            register={register}
            errors={errors.password}
            className="w-60 md:w-72 relative"
            icon={pwVisible ? <FaRegEyeSlash /> : <FaRegEye />}
            onIconClick={() => setPwVisible((prevState) => !prevState)}
          />
          <div className="w-full text-center">
            <Button
              type="submit"
              primary
              className="!mx-auto w-60 md:w-72"
              loading={loading}
            >
              บันทึก
            </Button>
            <span
              className="text-gray-500 cursor-pointer hover:text-black"
              onClick={() => reset()}
            >
              ล้างข้อมูลในฟอร์ม
            </span>
          </div>
        </form>
      </Modal>
      <Modal
        title={<p className="text-center text-xl">ฟอร์มแก้ไขผู้ใช้งาน</p>}
        open={editModalopen}
        onCancel={onCancelEdit}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <form
          onSubmit={onEditSubmit}
          className="flex flex-wrap flex-col gap-x-5 gap-y-5 items-center justify-center mt-10"
        >
          <Input
            name="email"
            type="email"
            placeholder="อีเมล"
            register={register2}
            errors={errors2.email}
            className="w-60 md:w-72"
          />
          <Input
            name="name"
            placeholder="ชื่อ"
            register={register2}
            errors={errors2.name}
            className="w-60 md:w-72"
          />
          <Input
            name="surname"
            placeholder="นามสกุล"
            register={register2}
            errors={errors2.surname}
            className="w-60 md:w-72"
          />
          <p
            className="flex gap-1 items-center cursor-pointer text-gray-500 hover:text-black"
            onClick={() => setShowEditPassword(!showEditPassword)}
          >
            แก้ไขรห้สผ่าน
            {!showEditPassword ? <FaAngleDown /> : <FaAngleUp />}
          </p>
          {showEditPassword && (
            <>
              <Input
                name="password"
                type={pwVisible ? "text" : "password"}
                placeholder="รหัสผ่าน"
                register={register2}
                errors={errors2.password}
                className="w-60 md:w-72 relative"
                icon={pwVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                onIconClick={() => setPwVisible((prevState) => !prevState)}
              />
              <Input
                name="confPassword"
                type={confPwVisible ? "text" : "password"}
                placeholder="ยืนยันรหัสผ่าน"
                register={register2}
                errors={errors2.confPassword}
                className="w-60 md:w-72 relative"
                icon={confPwVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                onIconClick={() => setConfPwVisible((prevState) => !prevState)}
              />
              {passwordError && (
                <div className="w-60 md:w-72 text-red-500 bg-red-100 p-3 rounded-md text-sm">
                  {passwordError}
                </div>
              )}
            </>
          )}
          <div className="w-full text-center">
            <Button
              type="submit"
              warning
              className="!mx-auto w-60 md:w-72"
              loading={loading}
            >
              แก้ไข
            </Button>
            <span
              className="text-gray-500 cursor-pointer hover:text-black"
              onClick={() => reset2()}
            >
              ล้างข้อมูลในฟอร์ม
            </span>
          </div>
        </form>
      </Modal>
      <Modal
        title={
          actionMode === "promotion" ? (
            <p className="text-center text-xl">
              เปลี่ยนสิทธิเป็น
              {selectedUser?.role.value === "admin" ? "เจ้าหน้าที่" : "แอดมิน"}
            </p>
          ) : (
            <p className="text-center text-xl">ลบผู้ใช้งาน</p>
          )
        }
        open={actionsModalopen}
        onCancel={onCancelAction}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="text-center my-5 text-base">
          {actionMode === "promotion" &&
            (selectedUser?.role.value.toUpperCase() === Role.OFFICER ? (
              <span>
                หากคุณแน่ใจที่จะปรับสิทธิให้ผู้ใช้ {selectedUser.email}{" "}
                เป็นแอดมิน
              </span>
            ) : (
              <span>
                หากคุณแน่ใจที่จะปรับสิทธิให้ผู้ใช้ {selectedUser?.email}{" "}
                เป็นเจ้าหน้าที่
              </span>
            ))}
          {actionMode === "delete" && (
            <span>หากคุณแน่ใจที่จะลบผู้ใช้ {selectedUser?.email}</span>
          )}
          <br />
          <span>
            กรุณากรอกอีเมลผู้ใช้งานที่ต้องการ{actionText}
            ลงในกล่องข้อความด้านล่างให้ถูกต้องเพื่อยืนยันการ
            {actionText}
          </span>
        </div>
        <form
          onSubmit={onActionSubmit}
          className="flex flex-wrap flex-col items-center gap-x-5 gap-y-5 justify-center"
        >
          <div>
            <Input
              name="actionEmail"
              type="email"
              placeholder="อีเมล"
              register={register3}
              errors={errors3.actionEmail}
              className="w-60 md:w-72"
            />
            <span className="text-red-500">{emailError}</span>
          </div>
          <div className="w-full text-center">
            <Button
              type="submit"
              danger
              className="!mx-auto w-60 md:w-72"
              loading={loading}
            >
              {actionText}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ManageUserPage;
