"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Empty, Modal, Spin, Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  FaAngleDown,
  FaAngleUp,
  FaIdCard,
  FaPencilAlt,
  FaTrash,
} from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { z } from "zod";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";

import { ObjectMap } from "@/types/issue";
import { UserProps } from "@/types/userProps";
import { createUserSchema, editUserSchema } from "@/types/validationSchemas";
import { errorHandler } from "@/helpers/errorHandler";
import useClientSession from "@/hooks/use-client-session";
import MyTooltip from "@/components/MyTooltip";
import Input from "@/components/inputGroup/Input";
import Button from "@/components/Button";

type CreateForm = z.infer<typeof createUserSchema>;
type EditForm = z.infer<typeof editUserSchema>;

const ManageUserPage = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [createModalopen, setCreateModalOpen] = useState(false);
  const [editModalopen, setEditModalOpen] = useState(false);
  const [promotionModalopen, setPromotionModalOpen] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const session = useClientSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateForm>({
    resolver: zodResolver(createUserSchema),
  });
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    setValue,
    formState: { errors: errors2 },
    clearErrors,
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
      const res = await axios.get("/api/common/user");
      if (res.status === 200) {
        setUsers(res.data.users);
      }
    } catch (err: any) {
      errorHandler(err);
    }
  };

  useEffect(() => {
    if (session) {
      setLoading(true);
      getUsers();
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!showEditPassword) {
      setValue("password", "");
      setValue("confPassword", "");
    }
  }, [showEditPassword]);

  const columns: ColumnsType<UserProps> = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      width: "7%",
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
                  onClick={() => handlePromotionClick(record)}
                >
                  <FaIdCard />
                </div>
              </MyTooltip>
              <MyTooltip title="ลบผู้ใช้">
                <div
                  className="cursor-pointer hover:text-blue-300"
                  onClick={() => handleDeleteClick(record)}
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

  const onCreateSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/common/user", data, {
        headers: {
          "user-id": session?.user.id,
        },
      });
      if (res.status === 201) {
        setCreateModalOpen(false);
        setLoading(false);
        toast.success("สร้างผู้ใช้งานสำเร็จ");
        reset();
        getUsers();
      }
    } catch (err: any) {
      setCreateModalOpen(false);
      setLoading(false);
      errorHandler(err);
    }
  });

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
          setEditModalOpen(false);
          setLoading(false);
          toast.success("แก้ไขผู้ใช้งานสำเร็จ");
          reset2();
          getUsers();
        }
      } catch (err: any) {
        setEditModalOpen(false);
        setLoading(false);
        errorHandler(err);
      }
    }
  });

  const onPromotionSubmit = handleSubmit3(async (data) => {
    if (!data.promotionEmail) {
      setEmailError("กรุณากรอกอีเมล");
      return;
    }

    if (data.promotionEmail && data.promotionEmail !== selectedUser?.email) {
      setEmailError("อีเมลที่กรอกไม่ถูกต้อง");
      return;
    }

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
        setPromotionModalOpen(false);
        setLoading(false);
        toast.success("ปรับสิทธิผู้ใช้งานสำเร็จ");
        reset3();
        getUsers();
      }
    } catch (err: any) {
      setPromotionModalOpen(false);
      setLoading(false);
      errorHandler(err);
    }
  });

  const onCancelEdit = () => {
    setEditModalOpen(false);
    setShowEditPassword(false);
    clearErrors();
  };

  const onCancelPromotion = () => {
    setPromotionModalOpen(false);
    reset3();
    setEmailError(null);
  };

  const handleCreateClick = () => {
    setCreateModalOpen(true);
    setEditModalOpen(false);
    setPromotionModalOpen(false);
  };

  const handleDeleteClick = async (record: UserProps) => {
    Swal.fire({
      title: "คำเตือน",
      text: `คุณต้องการลบผู้ใช้ ${record.email} ใช่หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ไม่",
      confirmButtonText: "ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(record.id);
      }
    });
  };

  const handleEditClick = (record: UserProps) => {
    setEditModalOpen(true);
    setCreateModalOpen(false);
    setPromotionModalOpen(false);
    setSelectedId(record.id);
    setValue("email", record.email);
    setValue("name", record.name);
    setValue("surname", record.surname);
    setValue("password", "");
    setValue("confPassword", "");
    setPasswordError(null);
  };

  const handlePromotionClick = (record: UserProps) => {
    setPromotionModalOpen(true);
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setSelectedUser(record);
  };

  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.delete(`/api/common/user/${id}`, {
        headers: {
          "user-id": session?.user.id,
        },
      });
      if (res.status === 200) {
        setLoading(false);
        toast.success("ลบผู้ใช้งานสำเร็จ");
        getUsers();
      }
    } catch (err: any) {
      setLoading(false);
      errorHandler(err);
    }
  };

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
        {loading ? (
          <Spin size="large" className="flex justify-center" />
        ) : users.length > 0 ? (
          <Table columns={columns} dataSource={users} scroll={{ x: 1000 }} />
        ) : (
          <Empty />
        )}
      </div>
      <Modal
        title={<p className="text-center text-xl">ฟอร์มสร้างผู้ใช้งาน</p>}
        open={createModalopen}
        onCancel={() => setCreateModalOpen(false)}
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
            type="password"
            placeholder="รหัสผ่าน"
            register={register}
            errors={errors.password}
            className="w-60 md:w-72"
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
                type="password"
                placeholder="รหัสผ่าน"
                register={register2}
                errors={errors2.password}
                className="w-60 md:w-72"
              />
              <Input
                name="confPassword"
                type="password"
                placeholder="ยืนยันรหัสผ่าน"
                register={register2}
                errors={errors2.confPassword}
                className="w-60 md:w-72"
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
          <p className="text-center text-xl">
            ปรับสิทธิเป็น
            {selectedUser?.role.value === "admin" ? "เจ้าหน้าที่" : "แอดมิน"}
          </p>
        }
        open={promotionModalopen}
        onCancel={onCancelPromotion}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="text-center my-5 text-base">
          {selectedUser?.role.value.toUpperCase() === Role.OFFICER ? (
            <span>
              หากคุณแน่ใจที่จะปรับสิทธิให้ผู้ใช้ {selectedUser.email} เป็นแอดมิน
            </span>
          ) : (
            <span>
              หากคุณแน่ใจที่จะปรับสิทธิให้ผู้ใช้ {selectedUser?.email}{" "}
              เป็นเจ้าหน้าที่
            </span>
          )}
          <br />
          <span>
            กรุณากรอกอีเมลผู้ใช้งานที่ต้องการเปลี่ยนสิทธิลงใน input
            ด้านล่างให้ถูกต้องเพื่อยืนยันการเปลี่ยนสิทธิ
          </span>
        </div>
        <form
          onSubmit={onPromotionSubmit}
          className="flex flex-wrap flex-col items-center gap-x-5 gap-y-5 justify-center"
        >
          <div>
            <Input
              name="promotionEmail"
              type="email"
              placeholder="อีเมล"
              register={register3}
              errors={errors3.promotionEmail}
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
              เปลี่ยนสิทธิ
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ManageUserPage;
