"use client";
import "../../app/css/additional-styles/utility-patterns.css";
import "../../app/css/additional-styles/theme.css";
import { useEffect, useState } from "react";
import Accordion from "./accordion";
import { useForm, SubmitHandler } from "react-hook-form";
import { useFormContext } from "../forms/formContext";
import toast from "react-hot-toast";
import { getErrorMessage, fetchCsrfToken } from "@/lib/client/clientUtils";
import {
  years,
  courses,
  branches,
  problems,
} from "@/lib/constants/dropdownOptions";
import { useRouter } from "next/navigation";
import Success from "./success";

const SIHMultiStepForm: React.FC = () => {
  const { formData, setFormData } = useFormContext();
  const [step, setStep] = useState<number>(1);
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [token, setToken] = useState("");
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string>("");

  const setTokenFunc = (getToken: string) => {
    setToken(getToken);
  };

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
  });
  const onSubmit: SubmitHandler<any> = async (data: any) => {
    data.recaptcha_token = token;

    const csrftoken = await fetchCsrfToken();
    setCsrfToken(csrftoken);

    setFormData({ ...formData, ...data });
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (!recaptchaToken) {
        alert("Please complete the reCAPTCHA");
        return;
      }

      try {
        let response = await fetch("/api/registration/sih", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify(data),
        });

        const res = await response.json();

        if (!response.ok || res.error) {
          console.log(response.json);
          toast.error(res.message);
          return;
        }

        setSuccess(true);
      } catch (error) {
        setRefreshReCaptcha(!refreshReCaptcha);
        console.error("Error submitting form:", error);

        toast.error(getErrorMessage(error));
      }
    }
  };

  if (isSuccess) {
    return (
      <Success
        message="Data Saved ! You're successfully registered for SIH!"
        joinLink="https://chat.whatsapp.com/EGnzKX13Xmi3pii7KOp7w5"
      />
    );
  }

  return (
    <div className="my-4 mx-auto p-6 rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Team Information */}
        {step === 1 && (
          <div>
            <h2 className="h2 mb-4">Team Information</h2>
            <div className="mb-4">
              <label className="block mb-2">
                Team Name<span className="text-red-600"> * </span>
              </label>
              <input
                {...register("team_info.team_name", {
                  required: "Team Name is required",
                })}
                name="team_info.team_name"
                type="text"
                placeholder="Enter a unique team name"
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              />
              {errors.team_info?.team_name && (
                <p className="text-red-500">
                  {errors.team_info.team_name.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">
                Team Leader&apos;s Name<span className="text-red-600"> * </span>
              </label>
              <input
                {...register("team_info.team_leader.name", {
                  required: "Team Leader Name is required",
                })}
                name="team_info.team_leader.name"
                type="text"
                placeholder="Enter the team leader's name"
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              />
              {errors.team_info?.team_leader?.name && (
                <p className="text-red-500">
                  {errors.team_info.team_leader.name.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">
                Team Leader&apos;s Email
                <span className="text-red-600"> * </span>
              </label>
              <input
                {...register("team_info.team_leader.email", {
                  required: "Team Leader Email is required",
                })}
                name="team_info.team_leader.email"
                type="email"
                placeholder="Enter the team leader's email"
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              />
              {errors.team_info?.team_leader?.email && (
                <p className="text-red-500">
                  {errors.team_info.team_leader.email.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">
                Team Leader&apos;s Phone Number
                <span className="text-red-600"> * </span>
              </label>
              <input
                {...register("team_info.team_leader.phone", {
                  required: "Team Leader Phone is required",
                })}
                name="team_info.team_leader.phone"
                type="tel"
                pattern="[1-9]{1}[0-9]{9}"
                placeholder="Enter the team leader's phone number"
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              />
              {errors.team_info?.team_leader?.phone && (
                <p className="text-red-500">
                  {errors.team_info.team_leader.phone.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block">
                Team Leader&apos;s Role in Team
                <span className="text-red-600"> * </span>
              </label>
              <input
                {...register(`team_info.team_leader.role`, {
                  required: "Role is required",
                })}
                name={`team_info.team_leader.role`}
                type="text"
                placeholder="Enter role in team"
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              />
              {errors.team_info?.team_leader?.role && (
                <p className="text-red-500">
                  {errors.team_info.team_leader.role.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block">
                Team Leader&apos;s College ID/USN
                <span className="text-red-600"> * </span>
              </label>
              <input
                {...register(`team_info.team_leader.enrollment_id`, {
                  required: "College ID is required",
                })}
                name={`team_info.team_leader.enrollment_id`}
                pattern="[1][D][S][1-2][0-9][A-Z][A-Z][0-9]{3}"
                type="text"
                placeholder="Enter college ID"
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              />
              {errors.team_info?.team_leader?.enrollment_id && (
                <p className="text-red-500">
                  {errors.team_info.team_leader.enrollment_id.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block">
                Team Leader&apos;s Course/Department
                <span className="text-red-600"> * </span>
              </label>
              <select
                {...register(`team_info.team_leader.course`, {
                  required: "Course is required",
                })}
                name={`team_info.team_leader.course`}
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:outline-none focus:border-2 focus:border-green-500"
              >
                {courses.map((course, idx) => (
                  <option
                    className="w-full px-4 py-2 border bg-black t rounded-md form-input focus:outline-none focus:border-2 focus:border-green-500"
                    value={course}
                    key={idx}
                  >
                    {course}
                  </option>
                ))}
              </select>
              {errors.team_info?.team_leader?.course && (
                <p className="text-red-500">
                  {errors.team_info.team_leader.course.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block">
                Team Leaders&apos;s Year of Study
                <span className="text-red-600"> * </span>
              </label>
              <select
                {...register(`team_info.team_leader.year_of_study`, {
                  required: "Year of study is required",
                })}
                name={`team_info.team_leader.year_of_study`}
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              >
                {years.map((year, idx) => (
                  <option
                    className="w-full px-4 py-2 border rounded-md bg-black form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                    value={year}
                    key={idx}
                  >
                    {year}
                  </option>
                ))}
              </select>
              {errors.team_info?.team_leader?.year_of_study && (
                <p className="text-red-500">
                  {errors.team_info.team_leader.year_of_study.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block">
                Team Leader&apos;s Branch
                <span className="text-red-600"> * </span>
              </label>
              <select
                {...register(`team_info.team_leader.branch`, {
                  required: "Branch is required",
                })}
                name={`team_info.team_leader.branch`}
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              >
                {branches.map((branch, idx) => (
                  <option
                    className="w-50 text-wrap px-4 py-2 border rounded-md bg-black form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                    value={branch}
                    key={idx}
                  >
                    {branch}
                  </option>
                ))}
              </select>
              {errors.team_info?.team_leader?.branch && (
                <p className="text-red-500">
                  {errors.team_info.team_leader.branch.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white rounded-lg py-2 px-4  hover:bg-green-600 "
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Team Members Information */}
        {step === 2 && (
          <div>
            <h2 className="h2 mb-4">Team Members Information</h2>

            {formData.team_members.map((member, index) => (
              <Accordion key={index} title={`Member ${index + 1}`}>
                <div className="mb-4">
                  <label className="block">
                    Name<span className="text-red-600"> * </span>
                  </label>
                  <input
                    {...register(`team_members.${index}.name`, {
                      required: "Name is required",
                    })}
                    name={`team_members.${index}.name`}
                    type="text"
                    placeholder="Enter member's name"
                    className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                  />
                  {errors.team_members?.[index]?.name && (
                    <p className="text-red-500">
                      {errors.team_members[index].name.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block">
                    Email<span className="text-red-600"> * </span>
                  </label>
                  <input
                    {...register(`team_members.${index}.email`, {
                      required: "Email is required",
                    })}
                    name={`team_members.${index}.email`}
                    type="email"
                    placeholder="Enter member's email"
                    className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                  />
                  {errors.team_members?.[index]?.email && (
                    <p className="text-red-500">
                      {errors.team_members[index].email.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block">
                    Phone Number<span className="text-red-600"> * </span>
                  </label>
                  <input
                    {...register(`team_members.${index}.phone`, {
                      required: "Phone number is required",
                    })}
                    name={`team_members.${index}.phone`}
                    pattern="[1-9]{1}[0-9]{9}"
                    type="tel"
                    placeholder="Enter member's phone number"
                    className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                  />
                  {errors.team_members?.[index]?.phone && (
                    <p className="text-red-500">
                      {errors.team_members[index].phone.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block">
                    Role in Team<span className="text-red-600"> * </span>
                  </label>
                  <input
                    {...register(`team_members.${index}.role`, {
                      required: "Role is required",
                    })}
                    name={`team_members.${index}.role`}
                    type="text"
                    placeholder="Enter role in team"
                    className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                  />
                  {errors.team_members?.[index]?.role && (
                    <p className="text-red-500">
                      {errors.team_members[index].role.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block">
                    College ID/USN
                    <span className="text-red-600"> * </span>
                  </label>
                  <input
                    {...register(`team_members.${index}.enrollment_id`, {
                      required: "College ID is required",
                    })}
                    name={`team_members.${index}.enrollment_id`}
                    pattern="[1][D][S][1-2][0-9][A-Z][A-Z][0-9]{3}"
                    type="text"
                    placeholder="Enter college ID"
                    className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                  />
                  {errors.team_members?.[index]?.enrollment_id && (
                    <p className="text-red-500">
                      {errors.team_members[index].enrollment_id.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block">
                    Course/Department<span className="text-red-600"> * </span>
                  </label>
                  <select
                    {...register(`team_members.${index}.course`, {
                      required: "Course is required",
                    })}
                    name={`team_members.${index}.course`}
                    className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:outline-none focus:border-2 focus:border-green-500"
                  >
                    {courses.map((course, idx) => (
                      <option
                        className="w-full px-4 py-2 border bg-black t rounded-md form-input focus:outline-none focus:border-2 focus:border-green-500"
                        value={course}
                        key={idx}
                      >
                        {course}
                      </option>
                    ))}
                  </select>
                  {errors.team_members?.[index]?.course && (
                    <p className="text-red-500">
                      {errors.team_members[index].course.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block">
                    Year of Study<span className="text-red-600"> * </span>
                  </label>
                  <select
                    {...register(`team_members.${index}.year_of_study`, {
                      required: "Year of study is required",
                    })}
                    name={`team_members.${index}.year_of_study`}
                    className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                  >
                    {years.map((year, idx) => (
                      <option
                        className="w-full px-4 py-2 border rounded-md bg-black form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                        value={year}
                        key={idx}
                      >
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.team_members?.[index]?.year_of_study && (
                    <p className="text-red-500">
                      {errors.team_members[index].year_of_study.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block">
                    Branch<span className="text-red-600"> * </span>
                  </label>
                  <select
                    {...register(`team_members.${index}.branch`, {
                      required: "Branch is required",
                    })}
                    name={`team_members.${index}.branch`}
                    className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                  >
                    {branches.map((branch, idx) => (
                      <option
                        className="w-50 text-wrap px-4 py-2 border rounded-md bg-black form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                        value={branch}
                        key={idx}
                      >
                        {branch}
                      </option>
                    ))}
                  </select>
                  {errors.team_members?.[index]?.branch && (
                    <p className="text-red-500">
                      {errors.team_members[index].branch.message}
                    </p>
                  )}
                </div>
              </Accordion>
            ))}

            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-green-500 text-white rounded-lg py-2 px-4 hover:bg-green-600 focus:border-0 focus:outline-offset-0 focus:outline-green-500 mr-2"
            >
              Previous
            </button>

            <button
              type="submit"
              className="bg-green-500 text-white rounded-lg py-2 px-4 hover:bg-green-600 focus:border-0 focus:outline-offset-0 focus:outline-green-500"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 3: Project Information */}
        {step === 3 && (
          <div>
            <h2 className="h2 mb-4">Project Information</h2>

            <div className="mb-4">
              <label className="block mb-2">
                Project Title<span className="text-red-600"> * </span>
              </label>
              <input
                {...register("project_information.title", {
                  required: "Project Title is required",
                })}
                name="project_information.title"
                type="text"
                placeholder="Enter project title"
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              />
              {errors.project_information?.title && (
                <p className="text-red-500">
                  {errors.project_information.title.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">
                Project Abstract<span className="text-red-600"> * </span>
              </label>
              <textarea
                {...register("project_information.abstract", {
                  required: "Project Abstract is required",
                })}
                name="project_information.abstract"
                placeholder="Enter a brief description of the project"
                rows={6}
                className="w-full px-4 py-2 border rounded-md bg-transparent form-textarea focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              ></textarea>
              {errors.project_information?.abstract && (
                <p className="text-red-500">
                  {errors.project_information.abstract.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">
                Problem Statement<span className="text-red-600"> * </span>
              </label>
              <select
                {...register("project_information.problem_statement", {
                  required: "Problem Statement is required",
                })}
                size={1}
                name="project_information.problem_statement"
                className="w-full px-4 py-2 border rounded-md bg-transparent form-textarea focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              >
                {problems.map((problem, idx) => (
                  <option
                    className="px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                    value={problem}
                    key={idx}
                  >
                    SIH-{problem}
                  </option>
                ))}
              </select>
              {errors.project_information?.problem_statement && (
                <p className="text-red-500">
                  {errors.project_information.problem_statement.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">
                Technology Stack<span className="text-red-600"> * </span>
              </label>
              <input
                {...register("project_information.tech_stack", {
                  required: "Technology Stack is required",
                })}
                name="project_information.tech_stack"
                type="text"
                placeholder="Enter the tech stack (e.g. NextJS, TypeScript, Tailwind Css...)"
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              />
              {errors.project_information?.tech_stack && (
                <p className="text-red-500">
                  {errors.project_information.tech_stack.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-green-500 text-white rounded-lg py-2 px-4 hover:bg-green-600 focus:border-0 focus:outline-offset-0 focus:outline-green-500 mr-2"
            >
              Previous
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white rounded-lg py-2 px-4 hover:bg-green-600 focus:border-0 focus:outline-offset-0 focus:outline-green-500"
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SIHMultiStepForm;
