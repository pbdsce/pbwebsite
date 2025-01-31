'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className="loading">
      <p>Loading API Documentation...</p>
      <style jsx>{`
        .loading {
          padding: 20px;
          text-align: center;
          font-size: 1.2em;
        }
      `}</style>
    </div>
  ),
});

export default function ApiDocs() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <SwaggerUI url="/api-docs" />;
}