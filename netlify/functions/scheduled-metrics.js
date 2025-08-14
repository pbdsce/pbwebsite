const { pushMetrics } = require('./telemetry-setup');

exports.handler = async () => {
  try {
    await pushMetrics();
    return { statusCode: 200, body: 'Metrics pushed' };
  } catch (error) {
    console.error('Metrics error:', error);
    return { statusCode: 500, body: 'Metrics failed' };
  }
};
