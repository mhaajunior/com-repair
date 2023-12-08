"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useClientSession from "../hooks/use-client-session";
import { FaSignOutAlt, FaAngleDown, FaCog } from "react-icons/fa";
import { Role } from "@prisma/client";
import { Dropdown, Space } from "antd";
import Button from "./Button";

const Navbar = () => {
  const currentPath = usePathname();
  const session = useClientSession();
  const router = useRouter();

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
        <Link
          href="/api/auth/signout?callbackUrl=/"
          className="flex items-center gap-3"
        >
          <FaSignOutAlt />
          ออกจากระบบ
        </Link>
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
