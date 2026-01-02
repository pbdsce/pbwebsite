"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import SignIn from '../../components/Signin';
import { useStore } from '@/lib/zustand/store';

export default function Home() {
  const { isLoggedIn } = useStore();
  const router = useRouter();
  if (isLoggedIn) router.push('/');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-20">
      <SignIn />
    </div>
  );
}
