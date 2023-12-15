"use client";

import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const currentPath = usePathname();

  return (
    <>
      {!currentPath.startsWith("/sign") && (
        <footer className="w-full p-8 mt-auto">
          <div className="lg:text-xl text-lg text-gray-500 mx-auto">
            <div className="md:space-y-3 text-center">
              <p>
                ศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร
                กลุ่มบริการและสนับสนุนระบบคอมพิวเตอร์
              </p>
              <p>
                Computer System Services and Support Group, Information &
                Communication Technology Center
              </p>
              <p></p>
              <p>โทร. 17372, 17373</p>
              <p className="text-sm">พัฒนาโดย นายธีธัช วระโพธิ์ กพป. ศท.</p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
