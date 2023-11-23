"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useClientSession from "./hooks/use-client-session";

export const Navbar = () => {
  const currentPath = usePathname();
  const session = useClientSession();

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
        <Link href="/api/auth/signout?callbackUrl=/">ออกจากระบบ</Link>
      ) : (
        <Link href="/api/auth/signin">เข้าสู่ระบบ</Link>
      )}
    </nav>
  );
};
