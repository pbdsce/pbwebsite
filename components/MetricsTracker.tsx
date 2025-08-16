"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface BaseMetric {
  type: string;
  page: string;
  timestamp: number;
}

interface PageViewMetric extends BaseMetric {
  type: 'page_view';
  page: string;
  referrer: 'direct' | 'internal' | 'external';
}

interface ApiRequestMetric extends BaseMetric {
  type: 'api_request';
  endpoint: string;
  method: string;
  status_code: number;
  duration_ms: number;
}

interface PerformanceMetric extends BaseMetric {
  type: 'performance';
  page: string;
  load_time: number;
  dom_content_loaded: number;
  first_contentful_paint: number | null;
}

interface ErrorMetric extends BaseMetric {
  type: 'error';
  error_type: 'critical_error' | 'unhandled_rejection';
  page: string;
  message: string;
}

interface SessionMetric extends BaseMetric {
  type: 'session_duration' | 'session_end';
  page: string;
  duration_seconds: number;
}

type Metric = PageViewMetric | ApiRequestMetric | PerformanceMetric | ErrorMetric | SessionMetric;

let fetchOverrideCount = 0;
let globalOriginalFetch: typeof fetch | null = null;

export default function MetricsTracker() {
  const pathname = usePathname();
  const sessionStartRef = useRef<number>(Date.now());
  const instanceIdRef = useRef<number>(0);

  useEffect(() => {
    instanceIdRef.current = ++fetchOverrideCount;

    const sendMetrics = async (data: Metric) => {
      try {
        const fetchToUse = globalOriginalFetch || window.fetch;
        await fetchToUse('/metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to send metrics:', error);
        }
      }
    };

    const getReferrerType = (): 'direct' | 'internal' | 'external' => {
      if (!document.referrer) {
        return 'direct';
      }
      
      try {
        const referrerUrl = new URL(document.referrer);
        const currentUrl = new URL(window.location.href);
        
        return referrerUrl.hostname === currentUrl.hostname ? 'internal' : 'external';
      } catch {
        try {
          const currentHostname = window.location.hostname;
          const referrerLower = document.referrer.toLowerCase();
          const hostnamePattern = new RegExp(`https?://${currentHostname.replace('.', '\\.')}`, 'i');
          return hostnamePattern.test(referrerLower) ? 'internal' : 'external';
        } catch {
          return 'external';
        }
      }
    };

    if (fetchOverrideCount === 1) {
      globalOriginalFetch = window.fetch;
      
      window.fetch = async (...args) => {
        const [resource, config] = args;
        const startTime = performance.now();

        try {
          const response = await globalOriginalFetch!(...args);
          const endTime = performance.now();
          const duration = Math.round(endTime - startTime);

          if (typeof resource === 'string' && 
              (resource.startsWith('/api/') || resource.includes('/api/')) &&
              !resource.includes('/metrics')) {
            const cleanEndpoint = resource.split('?')[0].replace(/\/\d+/g, '/:id');
            const apiMetric: ApiRequestMetric = {
              type: 'api_request',
              page: pathname,
              endpoint: cleanEndpoint,
              method: config?.method || 'GET',
              status_code: response.status,
              duration_ms: duration,
              timestamp: Date.now()
            };
            sendMetrics(apiMetric);
          }

          return response;
        } catch (error) {
          const endTime = performance.now();
          const duration = Math.round(endTime - startTime);

          if (typeof resource === 'string' && 
              (resource.startsWith('/api/') || resource.includes('/api/')) &&
              !resource.includes('/metrics')) {
            
            const cleanEndpoint = resource.split('?')[0].replace(/\/\d+/g, '/:id');
            
            const apiMetric: ApiRequestMetric = {
              type: 'api_request',
              page: pathname,
              endpoint: cleanEndpoint,
              method: config?.method || 'GET',
              status_code: 0,
              duration_ms: duration,
              timestamp: Date.now()
            };
            
            sendMetrics(apiMetric);
          }

          throw error;
        }
      };
    }

    const handleCriticalError = (event: ErrorEvent) => {
      if (!event.error || !event.message || event.message.length < 5) {
        return;
      }

      const errorMetric: ErrorMetric = {
        type: 'error',
        error_type: 'critical_error',
        page: pathname,
        message: event.message.substring(0, 100),
        timestamp: Date.now()
      };
      sendMetrics(errorMetric);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      let message = 'Unknown rejection';
      if (event.reason instanceof Error) {
        message = event.reason.message;
      } else if (typeof event.reason === 'string') {
        message = event.reason;
      } else if (event.reason && typeof event.reason === 'object') {
        message = event.reason.toString();
      }
      
      if (message.length < 5) {
        return;
      }

      const errorMetric: ErrorMetric = {
        type: 'error',
        error_type: 'unhandled_rejection',
        page: pathname,
        message: message.substring(0, 100),
        timestamp: Date.now()
      };
      
      sendMetrics(errorMetric);
    };

    const trackPagePerformance = () => {
      if ('getEntriesByType' in performance) {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          const nav = navigationEntries[0];
          const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0];
          
          const performanceMetric: PerformanceMetric = {
            type: 'performance',
            page: pathname,
            load_time: Math.round(nav.loadEventEnd - nav.startTime),
            dom_content_loaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
            first_contentful_paint: firstContentfulPaint 
              ? Math.round(firstContentfulPaint.startTime) 
              : null,
            timestamp: Date.now()
          };
          
          sendMetrics(performanceMetric);
        }
      }
    };
    const pageViewMetric: PageViewMetric = {
      type: 'page_view',
      page: pathname,
      referrer: getReferrerType(),
      timestamp: Date.now()
    };
    
    sendMetrics(pageViewMetric);
    const SESSION_THRESHOLD_SECONDS = 30;

    const trackSessionDuration = () => {
      const sessionDuration = Math.round((Date.now() - sessionStartRef.current) / 1000); 
      
      if (sessionDuration > SESSION_THRESHOLD_SECONDS) { 
        const sessionMetric: SessionMetric = {
          type: 'session_duration',
          page: pathname,
          duration_seconds: sessionDuration,
          timestamp: Date.now()
        };
        
        sendMetrics(sessionMetric);
      }
    };

    window.addEventListener('error', handleCriticalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    if (document.readyState === 'complete') {
      setTimeout(trackPagePerformance, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(trackPagePerformance, 1000);
      });
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackSessionDuration();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      fetchOverrideCount--;
            if (fetchOverrideCount === 0 && globalOriginalFetch) {
        window.fetch = globalOriginalFetch;
        globalOriginalFetch = null;
      }
      
      window.removeEventListener('error', handleCriticalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname]);

  useEffect(() => {
    const SESSION_THRESHOLD_SECONDS = 30;
    
    const handleBeforeUnload = () => {
      const sessionDuration = Math.round((Date.now() - sessionStartRef.current) / 1000);
      
      if ('sendBeacon' in navigator && sessionDuration > SESSION_THRESHOLD_SECONDS) {
        const sessionEndMetric: SessionMetric = {
          type: 'session_end',
          page: pathname,
          duration_seconds: sessionDuration,
          timestamp: Date.now()
        };
        
        navigator.sendBeacon('/metrics', JSON.stringify(sessionEndMetric));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pathname]);

  return null;
}