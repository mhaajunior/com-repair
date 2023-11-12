import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full p-8 mt-auto">
      <div className="lg:flex lg:text-xl text-lg text-gray-500 mx-auto items-center justify-between">
        <div className="w-1/4 mx-auto">
          <Image src="/nso-logo.png" alt="nso logo" width={300} height={30} />
        </div>
        <div className="md:space-y-3 text-center lg:text-left">
          <p>ศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร กลุ่มบริการและสนับสนุน</p>
          <p>
            Services and Support Group Information & Communication Technology
            Center
          </p>
          <p>โทร. 17373, 17372</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
