"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useClientSession from "../hooks/use-client-session";
import {
  FaSignOutAlt,
  FaAngleDown,
  FaCog,
  FaUserEdit,
  FaRegEyeSlash,
  FaRegEye,
} from "react-icons/fa";
import { Role } from "@prisma/client";
import { Dropdown, Modal, Space } from "antd";
import Button from "./Button";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { errorHandler } from "@/helpers/errorHandler";
import axios from "axios";
import Input from "./inputGroup/Input";

const Navbar = () => {
  const [modalopen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const [confPwVisible, setConfPwVisible] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const currentPath = usePathname();
  const session = useClientSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const doSignOut = async () => {
    Swal.fire({
      title: "คำเตือน",
      text: "คุณแน่ใจที่จะออกจากระบบหรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลงชื่อออก",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        signOut({ callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL });
      }
    });
  };

  let navItems = [
    {
      title: "ฟอร์มแจ้งซ่อม",
      link: "/new",
      isAuthenticated: false,
    },
    {
      title: "ค้นหาใบแจ้ง",
      link: "/search",
      isAuthenticated: false,
    },
    {
      title: "ตารางแสดงใบแจ้ง",
      link: "/list",
      isAuthenticated: true,
      isOnlyAdmin: false,
    },
  ];

  let manageItems = [
    {
      key: "1",
      label: (
        <Link href="/manageUser" className="flex items-center gap-3">
          <FaCog />
          จัดการผู้ใช้งาน
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-3"
        >
          <FaUserEdit />
          เปลี่ยนรหัสผ่าน
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div onClick={doSignOut} className="flex items-center gap-3">
          <FaSignOutAlt />
          ออกจากระบบ
        </div>
      ),
    },
  ];

  if (session) {
    navItems = navItems.filter((item) => item.isAuthenticated);
    if (session.user.role !== Role.ADMIN) {
      navItems = navItems.filter((item) => !item.isOnlyAdmin);
      manageItems = manageItems.filter((item) => !["1"].includes(item.key));
    }
  } else {
    navItems = navItems.filter((item) => !item.isAuthenticated);
  }

  const onSubmit = handleSubmit(async (data) => {
    if (data.password && data.password !== data.confPassword) {
      setPasswordError("กรุณากรอกรหัสผ่านให้ตรงกัน");
      return;
    }
    delete data.confPassword;

    try {
      setLoading(true);
      const res = await axios.put(`/api/common/user`, data, {
        headers: {
          "user-id": session?.user.id,
        },
      });
      if (res.status === 200) {
        toast.success("แก้ไขรหัสผ่านสำเร็จ");
      }
    } catch (err: any) {
      errorHandler(err);
    }
    setLoading(false);
    clearData();
  });

  const clearData = () => {
    setModalOpen(false);
    reset();
    setPwVisible(false);
    setConfPwVisible(false);
    setPasswordError(null);
  };

  return (
    <>
      {!currentPath.startsWith("/sign") && (
        <nav className="flex justify-between items-center text-gray-500 font-semibold gap-x-2">
          <ul className="flex items-center gap-8">
            <li>
              <Link href="/">
                <Image src="/nso-logo.png" alt="logo" width={130} height={30} />
              </Link>
            </li>
            {navItems.map((item) => (
              <li key={item.title} className="hover:text-black">
                <Link
                  href={item.link}
                  className={item.link === currentPath ? "text-gray-900" : ""}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          {session ? (
            <ul className="flex items-center gap-8">
              <li className="hover:text-black">
                <Dropdown
                  menu={{
                    items: manageItems,
                  }}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      {session.user.name + " " + session.user.surname}
                      <FaAngleDown />
                    </Space>
                  </a>
                </Dropdown>
              </li>
              <li className="hover:text-black"></li>
            </ul>
          ) : (
            <Button
              primary
              className="!shadow-none"
              onClick={() => router.push("/api/auth/signin")}
            >
              เข้าสู่ระบบ
            </Button>
          )}
        </nav>
      )}
      <Modal
        title={<p className="text-center text-xl">เปลี่ยนรหัสผ่าน</p>}
        open={modalopen}
        onCancel={clearData}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <form
          onSubmit={onSubmit}
          className="flex flex-wrap flex-col gap-x-5 gap-y-5 items-center justify-center mt-10"
        >
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
          <Input
            name="confPassword"
            type={confPwVisible ? "text" : "password"}
            placeholder="ยืนยันรหัสผ่าน"
            register={register}
            errors={errors.confPassword}
            className="w-60 md:w-72 relative"
            icon={confPwVisible ? <FaRegEyeSlash /> : <FaRegEye />}
            onIconClick={() => setConfPwVisible((prevState) => !prevState)}
          />
          {passwordError && (
            <div className="w-60 md:w-72 text-red-500 bg-red-100 p-3 rounded-md text-sm">
              {passwordError}
            </div>
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
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Navbar;
