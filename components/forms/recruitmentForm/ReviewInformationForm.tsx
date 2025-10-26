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
  // otp: string;
}

interface ReviewInformationFormProps {
  formDataForSubmission: FormData;
  isSubmitting: boolean;
  isSubmissionComplete: boolean;
  // isEmailStillVerified: (email: string) => boolean;
  onEditInformation: () => void;
  onSubmitRegistration: (data: FormData) => void;
}

const ReviewInformationForm: React.FC<ReviewInformationFormProps> = ({
  formDataForSubmission,
  isSubmitting,
  isSubmissionComplete,
  // isEmailStillVerified,
  onEditInformation,
  onSubmitRegistration,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 lg:p-10 rounded-3xl bg-black/40 backdrop-blur-md shadow-2xl border border-gray-800">
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
            Review Your Information
          </h1>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="bg-gray-900/30 border border-gray-700 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <p className="text-white font-medium">
                  {formDataForSubmission.name}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium truncate">
                    {formDataForSubmission.email}
                  </p>
                  {/*
                  {isEmailStillVerified(formDataForSubmission.email) && (
                    <span className="text-green-400 text-xs flex items-center gap-1 ml-2 flex-shrink-0">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      Verified
                    </span>
                  )}
                  */}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Branch</label>
                <p className="text-white font-medium">
                  {formDataForSubmission.branch}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Year</label>
                <p className="text-white font-medium">
                  {formDataForSubmission.year_of_study}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">
                  {formDataForSubmission.year_of_study === "1st year"
                    ? "Admission Number"
                    : "USN"}
                </label>
                <p className="text-white font-medium">
                  {formDataForSubmission.college_id}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">WhatsApp</label>
                <p className="text-white font-medium">
                  {formDataForSubmission.whatsapp_number}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400">About Yourself</label>
              <p className="text-white font-medium text-sm leading-relaxed">
                {formDataForSubmission.about}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onEditInformation}
              className="flex-1 bg-gray-700 text-white rounded-xl py-3 px-6 hover:bg-gray-600 font-medium text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
              ← Edit Information
            </button>
            <button
              onClick={() => onSubmitRegistration(formDataForSubmission)}
              disabled={isSubmitting || isSubmissionComplete}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl py-3 px-6 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base transition-all duration-200 shadow-lg hover:shadow-green-500/25 transform hover:scale-[1.02] active:scale-[0.98]">
              {isSubmissionComplete
                ? "Registration Complete!"
                : isSubmitting
                ? "Submitting..."
                : "Submit Registration"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewInformationForm;
