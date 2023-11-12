import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  const navItems = [
    {
      title: "ฟอร์มแจ้งซ่อม",
      link: "/new",
    },
    {
      title: "ค้นหาใบแจ้ง",
      link: "/search",
    },
  ];

  return (
    <nav className="sm:px-16 md:px-24 py-5 flex justify-between items-center text-gray-500 font-semibold">
      <ul className="flex items-center gap-8">
        <li>
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={100} height={30} />
          </Link>
        </li>
        {navItems.map((item) => (
          <li key={item.title}>
            <Link href={item.link}>{item.title}</Link>
          </li>
        ))}
      </ul>
      <Link href="/login">เข้าสู่ระบบ</Link>
    </nav>
  );
};
