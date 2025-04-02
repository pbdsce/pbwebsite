"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase";
import "swagger-ui-react/swagger-ui.css";
import { useStore } from "@/lib/zustand/store";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading API Documentation...</p>
    </div>
  ),
});

export default function ApiDoc() {
  const { isLoggedIn, setLoggedIn } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [swaggerConfig, setSwaggerConfig] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        try {
          setLoggedIn(true);
          // Get the API docs with the user's UID as a query parameter
          const docsResp = await fetch(`/api/docs?uid=${uid}`);
          if (docsResp.ok) {
            const swaggerData = await docsResp.json();
            setSwaggerConfig(swaggerData);
          } else {
            setLoggedIn(false);
          }
        } catch (error) {
          console.log("Error getting document:", error);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setLoggedIn]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>Access Denied: Admin privileges required</p>
      </div>
    );
  }

  if (!swaggerConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading API documentation...</p>
      </div>
    );
  }

  return (
    <div className="swagger-wrapper">
      <SwaggerUI
        spec={swaggerConfig}
        docExpansion="list"
        defaultModelExpandDepth={5}
        defaultModelsExpandDepth={5}
      />
      <style jsx global>{`
        .swagger-ui .wrapper {
          padding: 0;
          max-width: none;
        }
        .swagger-ui .info {
          margin: 20px 0;
        }
        body {
          background: white;
        }
      `}</style>
    </div>
  );
}
