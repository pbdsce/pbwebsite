export const metadata = {
  title: 'Home',
  description: 'Landing page',
}

import Hero from '@/components/hero'
import Domains from '@/components/domains'
import '../css/additional-styles/landing.css';
import Landing from '@/components/landing';

export default function Home() {
  return (
    <>
      <Hero />
      <Domains />
      <Landing />
    </>
  )
}
