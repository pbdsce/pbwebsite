"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase'; 
import { doc, setDoc } from 'firebase/firestore';
import '../app/globals.css';


const Signup = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [secretCode, setSecretCode] = useState('');
    const [signupError, setSignupError] = useState(''); // State for signup error
    const [dbError, setDbError] = useState(''); // State for database error
    const [success, setSuccess] = useState(''); // State for success message
  
    const handleSignup = async (event: React.FormEvent) => {
      event.preventDefault();
      setSignupError(''); // Clear previous errors
      setDbError('');   // Clear previous database errors

      if (!email.endsWith("@pointblank.club")) {
        setSignupError("Access not granted!");
        return;
      }    
  
      if (password !== confirmPassword) {
        setSignupError('Passwords do not match');
        return;
      }
  
      if (secretCode !== process.env.NEXT_PUBLIC_ADMIN_SECRET_CODE) {
        setSignupError('Invalid secret code for admin');
        return;
      }
  
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // if (role === 'admin') {
        //   try {
        //     await fetch ('/api/admin', {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json',
        //       },
        //       body: JSON.stringify({
        //         email,
        //         role,
        //         userId: user.uid,
        //       }),
        //     });
  
        //     setSuccess('Successfully signed up!');
        //     window.location.reload(); // Redirect to login after successful signup
        //   } catch (dbErr) {
        //     setDbError('Failed to save user data to the database');
        //     console.error('Database error:', dbErr);
        //   }
        // } else {

          setSuccess('Successfully signed up!');
          window.location.reload(); // Redirect to login page after successful signup


        // }
      } catch (signupErr: any) {
        setSignupError(signupErr.message || 'Failed to sign up');
        console.error('Signup error:', signupErr);
      }
    };
  
    return (
      <div className="max-w-md bg-[#151916] p-10 rounded-xl shadow-lg shadow-green-600/100  ">
        <div className="text-3xl font-semibold text-center mb-8 text-white">
          Signup
        </div>
        <form onSubmit={handleSignup}>
          <div className="relative mb-6">
            <input
              type="text"
              id="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full bg-transparent border-0 border-b-2 border-green-500 text-white placeholder-transparent focus:border-green-400 focus:outline-none focus:ring-0 autofill:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.8)] autofill:text-white pt-2 m-1"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-0 text-white text-base transition-all duration-500 transform -translate-y-3 scale-75 origin-left cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base peer-focus:-translate-y-3 peer-focus:scale-75"
            >
              Email Address
            </label>
          </div>
          <div className="relative mb-6">
            <input
              type="password"
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-transparent border-0 border-b-2 border-green-500 text-white placeholder-transparent focus:border-green-400 focus:outline-none focus:ring-0 autofill:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.8)] autofill:text-white pt-2 m-1"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-0 top-0 text-white text-base transition-all duration-500 transform -translate-y-3 scale-75 origin-left cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base peer-focus:-translate-y-3 peer-focus:scale-75"
            >
              Password
            </label>
          </div>
          <div className="relative mb-6">
            <input
              type="password"
              id="confirm-password"
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="peer w-full bg-transparent border-0 border-b-2 border-green-500 text-white placeholder-transparent focus:border-green-400 focus:outline-none focus:ring-0 autofill:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.8)] autofill:text-white pt-2 m-1"
              required
            />
            <label
              htmlFor="confirm-password"
              className="absolute left-0 top-0 text-white text-base transition-all duration-500 transform -translate-y-3 scale-75 origin-left cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base peer-focus:-translate-y-3 peer-focus:scale-75"
            >
              Confirm Password
            </label>
          </div>
          {/* <div className="mb-4">
            <label className="block mb-2 text-white font-semibold">Sign up as:</label>
            <div className="flex items-center">
              <input
                type="radio"
                id="user"
                name="role"
                value="user"
                checked={role === 'user'}
                onChange={() => setRole('user')}
                className="mr-2"
              />
              <label htmlFor="user" className="text-white mr-4">User</label>
              <input
                type="radio"
                id="admin"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={() => setRole('admin')}
                className="mr-2"
              />
              <label htmlFor="admin" className="text-white">Admin</label>
            </div>
          </div>
          {role === 'admin' && ( */}
            <div className="relative mb-6">
              <input
                type="text"
                id="secret-code"
                placeholder=" "
                value={secretCode}
                onChange={(e) => {
                  console.log(e.target.value);
                  setSecretCode(e.target.value)}}
                className="peer w-full bg-transparent border-0 border-b-2 border-green-500 text-white placeholder-transparent focus:border-green-400 focus:outline-none focus:ring-0 autofill:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.8)] autofill:text-white pt-2 m-1"
                required
              />
              <label
                htmlFor="secret-code"
                className="absolute left-0 top-0 text-white text-base transition-all duration-500 transform -translate-y-3 scale-75 origin-left cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base peer-focus:-translate-y-3 peer-focus:scale-75"
              >
                Secret Code
              </label>
            </div>
          {/* )} */}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full p-3  bg-green-600 text-white rounded-md hover:bg-green-500"
            >
              Signup
            </button>
          </div>
          {signupError && <p className="text-red-500">{signupError}</p>}
          {dbError && <p className="text-yellow-500">{dbError}</p>} {/* Display database error */}
          {success && <p className="text-green-500">{success}</p>} {/* Display success message */}
        </form>
      </div>
    );
  };
  
  export default Signup;

