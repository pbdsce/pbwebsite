"use client";
import React, { useEffect, useState } from 'react';
import Login from '../../components/Login';
import Signup from '../../components/Signup';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/Firebase';
import { useRouter } from 'next/navigation';
export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-20">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setIsLogin(true)}
          className={`p-3 rounded-md font-semibold ${isLogin ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`p-3 rounded-md font-semibold ${!isLogin ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Signup
        </button>
      </div>
      {isLogin ? <Login /> : <Signup />}
    </div>
  );
}

