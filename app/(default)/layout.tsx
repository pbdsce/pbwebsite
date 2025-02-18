'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import AOS from 'aos'
import 'aos/dist/aos.css'

import Footer from '@/components/ui/footer'
import { Toaster } from 'react-hot-toast'


export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 700,
      easing: 'ease-out-cubic',
    })
  })

  return (
    <>
      <main className="grow">
        {children}
        <Toaster position='top-right' />
      </main>

      {pathname !== '/' && <Footer />}
    </>
  )
}
