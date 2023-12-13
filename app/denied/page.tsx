import { FaUserLock } from "react-icons/fa";

const DeniedPage = () => {
  return (
    <div className="flex flex-col gap-5 font-bold justify-center items-center">
      <FaUserLock className="text-[200px]" />
      <span className="text-xl">คุณไม่มีสิทธิที่จะเยี่ยมชมหน้านี้</span>
    </div>
  );
};

export default DeniedPage;
