import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { FormData } from './types';

interface ParticipantFormProps {
  participantNumber: 1 | 2;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({ 
  participantNumber, 
  register, 
  errors, 
  watch 
}) => {
  const watchPreviousCTF = watch(`participant${participantNumber}.previousCTF`);
  
  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div className="bg-gray-800/30 border border-green-400/20 rounded-lg p-4">
        <h4 className="text-green-300 font-mono text-sm mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          Basic Information
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <input
              {...register(`participant${participantNumber}.name` as const, {
                required: "Name is required",
              })}
              placeholder="Full Name"
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder-gray-500"
            />
            {errors[`participant${participantNumber}`]?.name && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.name?.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register(`participant${participantNumber}.email` as const, {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              placeholder="Email Address"
              type="email"
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder-gray-500"
            />
            {errors[`participant${participantNumber}`]?.email && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.email?.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register(`participant${participantNumber}.phone` as const, {
                required: "Phone number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Invalid phone number (10 digits starting with 6-9)",
                },
              })}
              placeholder="Phone Number"
              maxLength={10}
              type="tel"
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder-gray-500"
            />
            {errors[`participant${participantNumber}`]?.phone && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.phone?.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register(`participant${participantNumber}.age` as const, {
                required: "Age is required",
                min: { value: 16, message: "Minimum age is 16" },
                max: { value: 100, message: "Maximum age is 100" },
              })}
              placeholder="Age"
              type="number"
              min="16"
              max="100"
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder-gray-500"
            />
            {errors[`participant${participantNumber}`]?.age && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.age?.message}
              </p>
            )}
          </div>

          <div>
            <select
              {...register(`participant${participantNumber}.gender` as const, {
                required: "Gender is required",
              })}
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors"
            >
              <option value="" className="bg-gray-900">Select Gender</option>
              <option value="Male" className="bg-gray-900">Male</option>
              <option value="Female" className="bg-gray-900">Female</option>
              <option value="Other" className="bg-gray-900">Other</option>
              <option value="Prefer not to say" className="bg-gray-900">Prefer not to say</option>
            </select>
            {errors[`participant${participantNumber}`]?.gender && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.gender?.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Participant Background Section */}
      <div className="bg-gray-800/30 border border-green-400/20 rounded-lg p-4">
        <h4 className="text-green-300 font-mono text-sm mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          Participant Background
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <select
              {...register(`participant${participantNumber}.experienceLevel` as const, {
                required: "Experience level is required",
              })}
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors"
            >
              <option value="" className="bg-gray-900">Select Experience Level</option>
              <option value="Beginner" className="bg-gray-900">Beginner</option>
              <option value="Intermediate" className="bg-gray-900">Intermediate</option>
              <option value="Advanced" className="bg-gray-900">Advanced</option>
            </select>
            {errors[`participant${participantNumber}`]?.experienceLevel && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.experienceLevel?.message}
              </p>
            )}
          </div>

          <div>
            <select
              {...register(`participant${participantNumber}.affiliation` as const, {
                required: "Affiliation is required",
              })}
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors"
            >
              <option value="" className="bg-gray-900">Select Affiliation</option>
              <option value="Student" className="bg-gray-900">Student</option>
              <option value="Professional" className="bg-gray-900">Professional</option>
              <option value="Hobbyist" className="bg-gray-900">Hobbyist</option>
            </select>
            {errors[`participant${participantNumber}`]?.affiliation && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.affiliation?.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <input
              {...register(`participant${participantNumber}.affiliationName` as const, {
                required: "Affiliation name is required",
              })}
              placeholder="College Name / Company Name / Organization"
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder-gray-500"
            />
            {errors[`participant${participantNumber}`]?.affiliationName && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.affiliationName?.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <select
              {...register(`participant${participantNumber}.previousCTF` as const, {
                required: "Please select if you have participated in CTFs before",
              })}
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors"
            >
              <option value="" className="bg-gray-900">Have you participated in CTFs before?</option>
              <option value="Yes" className="bg-gray-900">Yes</option>
              <option value="No" className="bg-gray-900">No</option>
            </select>
            {errors[`participant${participantNumber}`]?.previousCTF && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.previousCTF?.message}
              </p>
            )}
          </div>

          {watchPreviousCTF === "Yes" && (
            <div className="md:col-span-2">
              <textarea
                {...register(`participant${participantNumber}.ctfNames` as const, {
                  required: watchPreviousCTF === "Yes" ? "Please mention which CTFs you have participated in" : false,
                })}
                placeholder="Which CTFs have you participated in? (e.g., picoCTF, NAHAMCON CTF, Google CTF, etc.)"
                rows={3}
                className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder-gray-500 resize-none"
              />
              {errors[`participant${participantNumber}`]?.ctfNames && (
                <p className="mt-1 text-xs text-red-400 font-mono">
                  {errors[`participant${participantNumber}`]?.ctfNames?.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantForm; 