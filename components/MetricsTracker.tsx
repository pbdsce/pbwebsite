"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MetricsTracker() {
  const pathname = usePathname();
  
  useEffect(() => {
    const recordPageView = async () => {
      try {
        const userAgent = navigator.userAgent;
        const loadTime = performance.now() / 1000;
        
        await fetch('/metrics', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'page_view',
            page: pathname,
            userAgent,
            loadTime,
            timestamp: Date.now()
          })
        });
      } catch (error) {
        console.error('Failed to record page view:', error);
      }
    };

    recordPageView();
  }, [pathname]);

  return null;
}