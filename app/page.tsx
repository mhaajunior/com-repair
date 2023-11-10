import Image from "next/image";
import mainPic from "../public/main-repair.png";

export default function Home() {
  return (
    <main className="md:flex items-center justify-between sm:px-24 py-16">
      <h1 className="font-black lg:text-[85px] text-[50px] text-center md:text-left md:w-2/4 title-text">
        ระบบแจ้งซ่อม <br />
        คอมพิวเตอร์ <br />
        ออนไลน์
      </h1>
      <Image src={mainPic} alt="main picture" priority={true} className="p-5" />
    </main>
  );
}
