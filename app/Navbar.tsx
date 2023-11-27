"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useClientSession from "../hooks/use-client-session";
import { FaSignOutAlt } from "react-icons/fa";

export const Navbar = () => {
  const currentPath = usePathname();
  const session = useClientSession();

  if (currentPath.startsWith("/sign")) {
    console.log("hi");
  }

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
      title: "เพิ่มผู้ใช้",
      link: "/createUser",
      isAuthenticated: true,
    },
  ];

  if (session) {
    navItems = navItems.filter((item) => item.isAuthenticated);
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
              <li key={item.title}>
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
              <li>{session.user.name + " " + session.user.surname}</li>
              <li>
                <Link href="/api/auth/signout?callbackUrl=/">
                  <FaSignOutAlt className="text-xl" />
                </Link>
              </li>
            </ul>
          ) : (
            <Link href="/api/auth/signin">เข้าสู่ระบบ</Link>
          )}
        </nav>
      )}
    </>
  );
};
