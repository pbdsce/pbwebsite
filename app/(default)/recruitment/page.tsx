"use client";
import RecruitmentForm from "@/components/forms/recruitmentForm";
import "../../css/additional-styles/form.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const RegisterPage = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <>

      <div className="w-50 mt-16 mx-auto flex flex-col items-center justify-center">
        <Link href="https://www.codebattle.in/" target="_blank" rel="noopener noreferrer">
          <Image
            src={"/images/codebattle.webp"}
            alt="recruitment-poster"
            height={300}
            width={1900}
            className="mt-9"
          />
        </Link>
        <div className="form-container my-2">
          <RecruitmentForm />
        </div>


      </div>
    </>
  );
};

export default RegisterPage;
