"use client";

import { useEffect } from "react";
import { onIdTokenChanged, getIdToken } from "firebase/auth";
import { auth } from "../Firebase"; 

export function FirebaseTokenSync() {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        
        const token = await getIdToken(user, true); 
       
        // Send token to backend to update the cookie
        const response = await fetch("/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          console.log("Token synced with backend");
        } else {
          console.error("Failed to sync token with backend");
        }
      } else {
        await fetch("/api/token", {
          method: "DELETE",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
