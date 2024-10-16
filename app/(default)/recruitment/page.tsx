"use client";
import RecruitmentForm from "@/components/forms/recruitmentForm";
import DotPattern from "@/components/magicui/dot-pattern";
import "../../css/additional-styles/form.css";
import { cn } from "@/lib/server/utils";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });
  });

  // useEffect(() => {
  //   router.push("/");
  // })
  return (
    <div className="w-50 mt-16 mx-auto flex flex-col items-center justify-center">
      <div className="form-container my-2">
        <RecruitmentForm />
      </div>
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "
        )}
      />
    </div>
  );
};

export default RegisterPage;
