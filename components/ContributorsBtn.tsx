'use client';

import { useRouter } from 'next/navigation';

export const ContributorsBtn = () => {
  const router = useRouter();

  const handleClick = async () => {
  
    fetch('/api/credits/newCollaborator', {
      method: 'POST',
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data from GitHub API');
        }
      })
      .catch((err: any) => {
        console.error('Error posting contributor:', err.message);
      });
  
    router.push('/Credits');
  };

  return (
    <div>
      <button type='button' onClick={handleClick} className="btn-sm px-4 py-2 text-l font-bold bg-gradient-to-tr from-gray-900 to-indigo-800 hover:from-indigo-800 hover:to-gray-900 active:from-gray-900 active:to-indigo-900 mx-3 rounded-xl inline-block">
        View Credits
      </button>
    </div>
  );
};