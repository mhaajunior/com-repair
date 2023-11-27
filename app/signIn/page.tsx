"use client";

import Button from "@/components/Button";
import Input from "@/components/inputGroup/Input";
import { errorHandler } from "@/helpers/errorHandler";
import { signInSchema } from "@/types/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BsChevronLeft } from "react-icons/bs";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Alert } from "antd";
import useClientSession from "@/hooks/use-client-session";
import { useRouter } from "next/navigation";

type SignInForm = z.infer<typeof signInSchema>;

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

const SignInPage = (props: Props) => {
  const session = useClientSession();
  const router = useRouter();
  if (session) {
    router.push("/");
  }
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await signIn("credentials", {
        ...data,
        redirect: true,
        callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL,
      });
    } catch (err: any) {
      errorHandler(err);
      setLoading(false);
    }
  });

  return (
    <div className="w-[450px] center">
      <form
        className="card flex flex-col gap-8 items-center relative !px-16"
        onSubmit={onSubmit}
      >
        <Link href="/" className="absolute right-5 top-5 text-gray-400 z-10">
          <span className="flex cursor-pointer hover:text-black items-center">
            <BsChevronLeft className="mr-1" />
            กลับ
          </span>
        </Link>
        <div>
          <h1 className="text-2xl text-center text-[#09ad7f]">
            ระบบแจ้งซ่อมคอม
          </h1>
          <p className="text-md text-center">สำหรับเจ้าหน้าที่</p>
        </div>
        {props.searchParams?.error && (
          <div className="w-full text-red-500 bg-red-100 p-3 rounded-md text-sm">
            กรุณากรอกข้อมูลให้ถูกต้อง
          </div>
        )}
        <Input
          name="email"
          type="email"
          placeholder="อีเมล"
          register={register}
          errors={errors.email}
          className="w-full"
        />

        <Input
          name="password"
          type="password"
          placeholder="รหัสผ่าน"
          register={register}
          errors={errors.password}
          className="w-full"
        />

        <Button type="submit" primary className="w-full" loading={loading}>
          เข้าสู่ระบบ
        </Button>
      </form>
    </div>
  );
};

export default SignInPage;
