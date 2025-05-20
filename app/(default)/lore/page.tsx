import React from 'react';
import Heading from '@/components/lore/heading';
import LoresContainer from '@/components/lore/lore-container';
import { Lores } from '../../../components/lore/data/lores';

export const metadata = {
  title: 'Lore',
  description: 'Lore page',
}


export default function Lore() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-green-900/40 to-black text-white">
      <Heading />
      <LoresContainer Lores={Lores} />
    </div>
  );
}
