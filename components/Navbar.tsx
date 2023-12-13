"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useClientSession from "../hooks/use-client-session";
import { FaSignOutAlt, FaAngleDown, FaCog, FaUserEdit } from "react-icons/fa";
import { Role } from "@prisma/client";
import { Dropdown, Space } from "antd";
import Button from "./Button";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const currentPath = usePathname();
  const session = useClientSession();
  const router = useRouter();

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

  const editPassword = () => {};

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
        <div onClick={editPassword} className="flex items-center gap-3">
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

  return (
    <>
      {!currentPath.startsWith("/sign") && (
        <nav className="flex justify-between items-center text-gray-500 font-semibold">
          <ul className="flex items-center gap-8">
            <li>
              <Link href="/">
                <Image src="/logo.png" alt="logo" width={100} height={30} />
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
    </>
  );
};

export default Navbar;
