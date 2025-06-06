"use client";
import React, { useEffect } from 'react';
import SignIn from '../../components/Signin';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/Firebase';
import { useRouter } from 'next/navigation';

export default function Home() {
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
      <SignIn />
    </div>
  );
}
