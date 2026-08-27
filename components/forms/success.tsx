interface SuccessProps {
  message: string;
  joinLink: string;
}

export default function Success(props: SuccessProps) {
  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col p-6 sm:p-8 rounded-lg shadow-lg bg-black bg-opacity-30 backdrop-blur-lg border border-[#37ff00]">
        <div className="flex flex-col items-center text-center">
          <div className="inline-block p-4 bg-[#37ff00] rounded-full animate-bounce">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-[#37ff00]">
            Registration Successful!
          </h2>
          <p className="mt-4 text-lg text-white/50 leading-relaxed">
            {props.message}
          </p>
          <p className="mt-2 text-md text-white/50 leading-relaxed">
            Join the WhatsApp Group for further updates immediately.
          </p>
        </div>
        <div className="flex mx-auto items-center mt-6">
          <a
            href={props.joinLink}
            className="w-full px-6 py-3 bg-[#37ff00] hover:bg-[#2bcc00] text-white text-lg font-semibold rounded-full transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#37ff00] focus:ring-opacity-50 text-center"
          >
            Join WhatsApp Group!
          </a>
        </div>
      </div>
    </div>
  );
}
