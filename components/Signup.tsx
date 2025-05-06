// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   fetchSignInMethodsForEmail,
//   sendSignInLinkToEmail,
// } from "firebase/auth";
// import { auth } from "../Firebase";
// import { doc, setDoc } from "firebase/firestore";
// import "../app/globals.css";
// import { method } from "lodash";

// const Signup = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("user");
//   const [signupError, setSignupError] = useState(""); // State for signup error
//   const [dbError, setDbError] = useState(""); // State for database error
//   const [success, setSuccess] = useState(""); // State for success message

//   const handleSignup = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setSignupError(""); // Clear previous errors
//     setDbError(""); // Clear previous database errors

//     if (!email.endsWith("@pointblank.club")) {
//       setSignupError("Access not granted!");
//       return;
//     }

//     try {
//       const methods = await fetchSignInMethodsForEmail(auth, email);
//       console.log("Fetched methods: ", methods);
//       if (methods.length > 0) {
//         setSignupError("You are already registered. Please log in instead.");
//         router.push("/");
//         return;
//       }

//       const actionCodeSettings = {
//         // url: 'https://www.pointblank.club/admin',
//         url: "http://localhost:3000/admin",
//         handleCodeInApp: true,
//       };

//       await sendSignInLinkToEmail(auth, email, actionCodeSettings);
//       window.localStorage.setItem("emailForSignIn", email);
//       setSuccess("Verification link sent to your email!");
//     } catch (signupErr: any) {
//       setSignupError(signupErr.message || "Failed to sign up");
//       console.error("Email link error:", signupErr);
//     }
//   };

//   return (
//     <div className="max-w-md bg-[#151916] p-12 rounded-xl shadow-lg shadow-green-600/100  ">
//       <div className="text-3xl font-semibold text-center mb-8 text-white">
//         Signup
//       </div>
//       <form onSubmit={handleSignup}>
//         <div className="relative mb-6">
//           <input
//             type="text"
//             id="email"
//             placeholder=" "
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="peer w-full bg-transparent border-0 border-b-2 border-green-500 text-white placeholder-transparent focus:border-green-400 focus:outline-none focus:ring-0 autofill:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.8)] autofill:text-white pt-2 m-1"
//             required
//           />
//           <label
//             htmlFor="email"
//             className="absolute left-0 top-0 text-white text-base transition-all duration-500 transform -translate-y-3 scale-75 origin-left cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base peer-focus:-translate-y-3 peer-focus:scale-75"
//           >
//             Email Address
//           </label>
//         </div>
//         <div className="mb-4">
//           <button
//             type="submit"
//             className="w-full p-3  bg-green-600 text-white rounded-md hover:bg-green-500"
//           >
//             Signup
//           </button>
//         </div>
//         {signupError && <p className="text-red-500">{signupError}</p>}
//         {dbError && <p className="text-yellow-500">{dbError}</p>}{" "}
//         {success && <p className="text-green-500">{success}</p>}{" "}
//       </form>
//     </div>
//   );
// };

// export default Signup;