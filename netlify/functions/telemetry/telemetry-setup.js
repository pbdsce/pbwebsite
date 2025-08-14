// Re-export telemetry setup for Netlify functions
const { pushMetrics } = require('../../../telemetry/setup');

module.exports = { pushMetrics };
