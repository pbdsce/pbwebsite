const { Registry, collectDefaultMetrics, Counter, Histogram, Gauge } = require('prom-client');

// Create registry and collect default metrics
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
  buckets: [0.1, 0.5, 1, 2, 5, 10],
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

function getUserAgent(userAgent) {
  if (!userAgent) return 'unknown';
  if (userAgent.includes('Chrome')) return 'chrome';
  if (userAgent.includes('Firefox')) return 'firefox';
  if (userAgent.includes('Safari')) return 'safari';
  if (userAgent.includes('Edge')) return 'edge';
  return 'other';
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
      
      if (body.type === 'page_view') {
        const page = body.page || '/unknown';
        pageViews.inc({ page });
        
        if (body.loadTime && typeof body.loadTime === 'number') {
          pageLoadTime.observe({ page }, body.loadTime);
        }
        
        console.log(`Page view recorded: ${page} (${body.loadTime}s)`);
      }
      
      else if (body.type === 'api_request') {
        const endpoint = body.endpoint || '/unknown';
        const method = body.method || 'GET';
        const statusCode = body.status_code || '200';
        
        apiRequests.inc({ 
          endpoint, 
          method: method.toLowerCase(), 
          status_code: statusCode.toString()
        });
        
        console.log(`API request recorded: ${method} ${endpoint} - ${statusCode}`);
      }
      
      else if (body.type === 'error') {
        const errorType = body.error_type || 'unknown';
        const page = body.page || '/unknown';
        
        errorRate.inc({ error_type: errorType, page });
        
        console.log(`Error recorded: ${errorType} on ${page}`);
      }
      
      else if (body.type === 'user_activity') {
        if (body.active_users && typeof body.active_users === 'number') {
          activeUsers.set(body.active_users);
        }
      }
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
        metrics_pushed: pushSuccess
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