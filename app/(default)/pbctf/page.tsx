"use client";
import PBCTFForm from "@/components/forms/pbctfForm";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { motion } from "framer-motion";

const PBCTFRegisterPage = () => {
  return (
    <div className="min-h-screen mt-10 bg-black text-green-400 font-mono overflow-hidden">
      {/*PBCTF content commented out for future use
      <div className="hidden" id="secret-agent-flag" data-flag="pbctf{pls_h4ck_m3_d4ddy}">
        🕵️‍♂️ CTF SECRET AGENT FLAG: pbctf&#123;pls_h4ck_m3_d4ddy&#125; 🕵️‍♂️
      </div>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8 text-center"
        >
          <pre className="text-green-400 text-xs md:text-sm leading-tight">
{`
██████╗ ██████╗  ██████╗████████╗███████╗
██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔════╝
██████╔╝██████╔╝██║        ██║   █████╗  
██╔═══╝ ██╔══██╗██║        ██║   ██╔══╝  
██║     ██████╔╝╚██████╗   ██║   ██║     
╚═╝     ╚═════╝  ╚═════╝   ╚═╝   ╚═╝     
`}
            </pre>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 1.3 }}
              className="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent mt-4"
            />
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 1.3 }}
            className="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent mt-4"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gray-900/50 border border-green-400/30 rounded-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-300">PBCTF 4.0</div>
              <div className="text-sm text-gray-400">Capture The Flag</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-300">10AM to 5PM</div>
              <div className="text-sm text-gray-400">Competition Hours</div>
            </div>
            <div className="p-6">
              <PBCTFForm />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-300">Registration Status: OPEN</span>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gray-900/30 border border-green-400/20 rounded-lg"
        >
          <div className="border-b border-green-400/20 px-6 py-3">
            <h2 className="text-green-300 font-semibold">Registration Terminal</h2>
          </div>
          <div className="p-6">
            <PBCTFForm />
          </div>
        </motion.div>

       
      </div>

      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
              backgroundSize: "20px 20px",
            }}
          />
        </div>
      </div>
      */}
    </div>
  );
};

export default PBCTFRegisterPage;
