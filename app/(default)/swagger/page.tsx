"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase";
import "swagger-ui-react/swagger-ui.css";

type SwaggerConfigType = {
  openapi: string;
  info: {
    title: string;
    version: string;
    [key: string]: any;
  };
  [key: string]: any;
};

interface LoadingStateProps {
  message: string;
}

const LoadingState = ({ message }: LoadingStateProps) => (
  <div className="flex items-center justify-center min-h-screen">
    <p>{message}</p>
  </div>
);

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <LoadingState message="Loading API Documentation..." />,
});

export default function ApiDoc() {
  const [isLoading, setIsLoading] = useState(true);
  const [swaggerConfig, setSwaggerConfig] = useState<SwaggerConfigType | null>(
    null
  );
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const uid = user.uid;
          console.log("User ID:", uid);
          setLoggedIn(true);
          const docsResp = await fetch(`/api/docs?uid=${uid}`);
          console.log(docsResp);
          if (docsResp.ok) {
            const swaggerData = await docsResp.json();
            setSwaggerConfig(swaggerData);
          } else {
            throw new Error("Failed to fetch API documentation");
          }
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingState message="Checking authentication..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>Access Denied: Admin privileges required</p>
      </div>
    );
  }

  if (!swaggerConfig) {
    return <LoadingState message="Loading API documentation..." />;
  }

  return (
    <div className="swagger-wrapper">
      <main className="min-h-screen flex flex-col justify-center items-center">
        <SwaggerUI spec={swaggerConfig} />
      </main>
    </div>
  );
}
