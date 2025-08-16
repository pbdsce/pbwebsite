"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MetricsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const sendMetrics = async (data: any) => {
      try {
        await fetch('/metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (error) {
        console.error('Failed to send metrics:', error);
      }
    };

    let lastActivityTimestamp = Date.now();

    const updateActivity = () => {
      lastActivityTimestamp = Date.now();
    };

    const trackUserActivity = () => {
      if (Date.now() - lastActivityTimestamp < 60000) {
        sendMetrics({
          type: 'user_activity',
          action: 'session_active',
          page: pathname,
          timestamp: Date.now()
        });
      }
    };

    const activityEvents = ['mousemove', 'click', 'keydown', 'touchstart', 'touchmove'];
    activityEvents.forEach(event => window.addEventListener(event, updateActivity));

    const heartbeatInterval = setInterval(trackUserActivity, 30000);


    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [resource, config] = args;
      const startTime = performance.now();

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;

        if (
          typeof resource === 'string' &&
          (resource.startsWith('/api/') || resource.includes('api.')) &&
          !resource.includes('/metrics')
        ) {
          await sendMetrics({
            type: 'api_request',
            endpoint: resource,
            method: config?.method || 'GET',
            status_code: response.status,
            duration,
            timestamp: Date.now()
          });
        }

        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;

        if (
          typeof resource === 'string' &&
          (resource.startsWith('/api/') || resource.includes('api.')) &&
          !resource.includes('/metrics')
        ) {
          await sendMetrics({
            type: 'api_request',
            endpoint: resource,
            method: config?.method || 'GET',
            status_code: 0,
            duration,
            timestamp: Date.now()
          });
        }

        throw error;
      }
    };

    const handleError = (event: ErrorEvent) => {
      sendMetrics({
        type: 'error',
        error_type: 'javascript_error',
        page: pathname,
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now()
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      sendMetrics({
        type: 'error',
        error_type: 'unhandled_promise_rejection',
        page: pathname,
        message: event.reason?.message || event.reason,
        timestamp: Date.now()
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendMetrics({
          type: 'user_activity',
          action: 'page_visible',
          page: pathname,
          timestamp: Date.now()
        });
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();

      if (['button', 'a', 'input'].includes(tagName)) {
        sendMetrics({
          type: 'user_activity',
          action: 'click',
          element: tagName,
          page: pathname,
          element_text: target.textContent?.substring(0, 50) || '',
          timestamp: Date.now()
        });
      }
    };

    const trackPerformanceMetrics = () => {
      if ('getEntriesByType' in performance) {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          const nav = navigationEntries[0];

          const performanceData = {
            type: 'performance',
            page: pathname,
            dns_lookup_time: (nav.domainLookupEnd - nav.domainLookupStart) / 1000,
            tcp_connect_time: (nav.connectEnd - nav.connectStart) / 1000,
            request_response_time: (nav.responseEnd - nav.requestStart) / 1000,
            dom_processing_time: (nav.domComplete - nav.responseEnd) / 1000,
            total_load_time: (nav.loadEventEnd - nav.startTime) / 1000,
            timestamp: Date.now()
          };

          sendMetrics(performanceData);

          if (performanceData.total_load_time > 0) {
            sendMetrics({
              type: 'page_load_time',
              page: pathname,
              load_time: performanceData.total_load_time,
              timestamp: Date.now()
            });
          }
        }
      }
    };

    if (document.readyState === 'complete') {
      setTimeout(trackPerformanceMetrics, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(trackPerformanceMetrics, 1000);
      });
    }

    sendMetrics({
      type: 'page_view',
      page: pathname,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      referrer: document.referrer || 'direct',
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    });

    return () => {
      clearInterval(heartbeatInterval);
      activityEvents.forEach(event => window.removeEventListener(event, updateActivity));
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleClick);
      window.fetch = originalFetch;
    };
  }, [pathname]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon('/metrics', JSON.stringify({
          type: 'user_activity',
          action: 'page_unload',
          page: pathname,
          timestamp: Date.now()
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null;
}
