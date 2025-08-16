const { Registry, collectDefaultMetrics, Counter, Histogram, Gauge } = require('prom-client');

const register = new Registry();
collectDefaultMetrics({ register });

// Website-specific metrics
const pageViews = new Counter({
  name: 'pointblank_page_views_total',
  help: 'Total number of page views',
  labelNames: ['page'],
  registers: [register]
});

const pageLoadTime = new Histogram({
  name: 'pointblank_page_load_time_seconds',
  help: 'Page load time in seconds',
  labelNames: ['page'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
  registers: [register]
});

const apiRequests = new Counter({
  name: 'pointblank_api_requests_total',
  help: 'Total number of API requests',
  labelNames: ['endpoint', 'method', 'status_code'],
  registers: [register]
});

const metricsRequests = new Counter({
  name: 'pointblank_metrics_requests_total',
  help: 'Total number of requests to metrics endpoint',
  labelNames: ['source'],
  registers: [register]
});

const activeUsers = new Gauge({
  name: 'pointblank_active_users',
  help: 'Current number of active users',
  registers: [register]
});

const errorRate = new Counter({
  name: 'pointblank_errors_total',
  help: 'Total number of client-side errors',
  labelNames: ['error_type', 'page'],
  registers: [register]
});

const performanceMetrics = new Histogram({
  name: 'pointblank_performance_seconds',
  help: 'Various performance timings',
  labelNames: ['page', 'metric_type'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  registers: [register]
});

const userSessions = new Gauge({
  name: 'pointblank_active_sessions',
  help: 'Number of active user sessions',
  registers: [register]
});

// Track active sessions in memory (in production, use Redis or similar)
const activeSessions = new Map();
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const PUSHGATEWAY_URL = process.env.PUSHGATEWAY_URL;

async function pushToGateway(metrics) {
  if (!PUSHGATEWAY_URL) {
    console.error('PUSHGATEWAY_URL environment variable not set');
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(PUSHGATEWAY_URL, {
      method: 'POST',
      body: metrics,
      headers: {
        'Content-Type': 'text/plain',
        'User-Agent': 'pointblank-netlify-function/1.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Pushgateway error: ${response.status} ${response.statusText}`);
      return false;
    }

    console.log('Metrics pushed to Pushgateway successfully');
    return true;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Pushgateway request timed out');
    } else {
      console.error('Error pushing to Pushgateway:', error.message);
    }
    return false;
  }
}

function cleanupSessions() {
  const now = Date.now();
  let removedCount = 0;

  for (const [sessionId, lastSeen] of activeSessions.entries()) {
    if (now - lastSeen > SESSION_TIMEOUT) {
      activeSessions.delete(sessionId);
      removedCount++;
    }
  }

  userSessions.set(activeSessions.size);

  if (removedCount > 0) {
    console.log(`Cleaned up ${removedCount} inactive sessions. Active sessions: ${activeSessions.size}`);
  }
}


exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const source = event.headers['user-agent']?.includes('Prometheus') ? 'prometheus' : 'website';
    metricsRequests.inc({ source });

    if (event.httpMethod === 'POST' && event.headers['content-type']?.includes('application/json')) {
      const body = JSON.parse(event.body || '{}');

      // Generate session ID from IP + User Agent
      const sessionId = Buffer.from(
        `${event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown'}_${event.headers['user-agent'] || 'unknown'}`
      ).toString('base64');

      if (body.type === 'page_view') {
        const page = body.page || '/unknown';
        pageViews.inc({ page });

        // Track active session
        activeSessions.set(sessionId, Date.now());
        userSessions.set(activeSessions.size);

        console.log(`Page view recorded: ${page}`);
      }
      
      else if (body.type === 'page_load_time') {
        const page = body.page || '/unknown';
        const loadTime = body.load_time;

        if (loadTime && typeof loadTime === 'number' && loadTime > 0) {
          pageLoadTime.observe({ page }, loadTime);
          console.log(`Page load time recorded: ${page} - ${loadTime}s`);
        }
      } else if (body.type === 'api_request') {
        const endpoint = body.endpoint;
        const method = body.method;
        const statusCode = body.status_code;
        
        // Validate and normalize data
        const validEndpoint = endpoint || 'unknown';
        const validMethod = method ? method.toLowerCase() : 'unknown';
        const validStatus = typeof statusCode === 'number' ? statusCode.toString() : 'unknown';

        if (endpoint && method && typeof statusCode === 'number') {
          console.log(`API request recorded: ${method.toUpperCase()} ${endpoint} - ${statusCode}`);
        } else {
          console.warn('API request data incomplete:', {
            endpoint: endpoint || 'unknown',
            method: method || 'unknown',
            status_code: typeof statusCode === 'number' ? statusCode : 'unknown'
          });
        }
        
        apiRequests.inc({
          endpoint: validEndpoint,
          method: validMethod,
          status_code: validStatus
        });
      } else if (body.type === 'error') {
        const errorType = body.error_type || 'unknown';
        const page = body.page || '/unknown';
        
        errorRate.inc({ error_type: errorType, page });
        
        console.log(`Error recorded: ${errorType} on ${page}`);
      }
      
      else if (body.type === 'user_activity') {
        // Update session activity
        activeSessions.set(sessionId, Date.now());
        userSessions.set(activeSessions.size);

        if (body.action === 'session_active') {
          // Just update the session timestamp
          console.log(`User activity: ${body.action} on ${body.page}`);
        }
      }
      
      else if (body.type === 'performance') {
        const page = body.page || '/unknown';

        // Record various performance metrics
        const perfMetrics = [
          'dns_lookup_time',
          'tcp_connect_time',
          'request_response_time',
          'dom_processing_time',
          'total_load_time'
        ];

        perfMetrics.forEach(metric => {
          if (body[metric] && typeof body[metric] === 'number' && body[metric] > 0) {
            performanceMetrics.observe(
              { page, metric_type: metric },
              body[metric]
            );
          }
        });

        console.log(`Performance metrics recorded for: ${page}`);
      }
    }

    // Clean up old sessions periodically
    if (Math.random() < 0.1) { // 10% chance on each request
      cleanupSessions();
    }

    const metrics = await register.metrics();
    const pushSuccess = await pushToGateway(metrics);

    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: metrics
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: pushSuccess ? 'Metrics recorded and pushed successfully' : 'Metrics recorded (push failed)',
        timestamp: new Date().toISOString(),
        metrics_pushed: pushSuccess,
        active_sessions: activeSessions.size
      })
    };
    
  } catch (error) {
    console.error('Metrics function error:', error);

    try {
      const metrics = await register.metrics();
      await pushToGateway(metrics);
    } catch (fallbackError) {
      console.error('Fallback metrics push failed:', fallbackError);
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to handle metrics',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
