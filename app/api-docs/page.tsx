// app/api-docs/page.tsx
'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useEffect, useState } from 'react';

export default function ApiDoc() {
  const [spec, setSpec] = useState({});

  useEffect(() => {
    fetch('/api/docs')
      .then(response => response.json())
      .then(data => setSpec(data));
  }, []);

  return <SwaggerUI spec={spec} />;
}