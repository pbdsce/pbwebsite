"use client";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  email: string;
  whatsapp_number: string;
  college_id: string;
  year_of_study: string;
  branch: string;
  about: string;
}

interface ReviewInformationFormProps {
  formDataForSubmission: FormData;
  isSubmitting: boolean;
  onEditInformation: () => void;
  onSubmitRegistration: (data: FormData) => void;
}

const ReviewInformationForm: React.FC<ReviewInformationFormProps> = ({
  formDataForSubmission,
  isSubmitting,
  onEditInformation,
  onSubmitRegistration,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[900px] mx-auto p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#141414] shadow-2xl border border-white/10">
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#37ff00] to-[#2bcc00] bg-clip-text text-transparent mb-2">
            Review Your Information
          </h1>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-pbsurface border border-white/10 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/50">Name</label>
                <p className="text-white font-medium">
                  {formDataForSubmission.name}
                </p>
              </div>
              <div>
                <label className="text-sm text-white/50">Email</label>
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium truncate">
                    {formDataForSubmission.email}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm text-white/50">Branch</label>
                <p className="text-white font-medium">
                  {formDataForSubmission.branch}
                </p>
              </div>
              <div>
                <label className="text-sm text-white/50">Year</label>
                <p className="text-white font-medium">
                  {formDataForSubmission.year_of_study}
                </p>
              </div>
              <div>
                <label className="text-sm text-white/50">
                  {formDataForSubmission.year_of_study === "1st year"
                    ? "Admission Number"
                    : "USN"}
                </label>
                <p className="text-white font-medium">
                  {formDataForSubmission.college_id}
                </p>
              </div>
              <div>
                <label className="text-sm text-white/50">WhatsApp</label>
                <p className="text-white font-medium">
                  {formDataForSubmission.whatsapp_number}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm text-white/50">
                About Yourself
              </label>
              <p className="text-white font-medium text-sm leading-relaxed">
                {formDataForSubmission.about}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onEditInformation}
              className="flex-1 bg-pbsurface border border-white/10 text-white rounded-xl py-3 px-6 hover:bg-white/5 font-medium text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              ← Edit Information
            </button>
            <button
              onClick={() => onSubmitRegistration(formDataForSubmission)}
              disabled={isSubmitting}
              className="flex-1 bg-[#37ff00] text-black font-semibold rounded-xl py-3 px-6 hover:bg-[#37ff00]/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            >
              {isSubmitting ? "Proceeding..." : "Verify & Submit"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewInformationForm;
