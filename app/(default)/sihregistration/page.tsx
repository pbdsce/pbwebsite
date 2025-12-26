'use client'
import SIHRegistrationForm from "@/components/forms/sihForm";
import { FormProvider } from "@/components/forms/formContext";
import DotPattern from "@/components/magicui/dot-pattern";
import "../../css/additional-styles/form.css";
import { cn } from "@/lib/server/utils";
import { useRouter } from "next/navigation";
const RegisterPage = () => {

  return (
    <FormProvider>
      <div className="mt-16 mx-auto flex flex-col items-center justify-center">
        <div className="container">
          <div className="title items-center justify-center mt-8">
            <span className="block"></span>
            <h1 className="h1 text-center">
              Register for Smart India Hackathon!
            </h1>
          </div>
        </div>

        <div className="form-container my-2">
          <SIHRegistrationForm data-aos="zoom-y-out" data-aos-delay="350" />
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
    </FormProvider>
  );
};

export default RegisterPage;
