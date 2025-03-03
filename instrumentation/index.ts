// instrumentation/index.ts - Updated version
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      const { NodeSDK } = await import('@opentelemetry/sdk-node');
      const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-proto');
      const { OTLPLogExporter } = await import('@opentelemetry/exporter-logs-otlp-proto');
      const { Resource } = await import('@opentelemetry/resources');
      const { SemanticResourceAttributes } = await import('@opentelemetry/semantic-conventions');
      const { LoggerProvider, SimpleLogRecordProcessor } = await import('@opentelemetry/sdk-logs');
      const { logs } = await import('@opentelemetry/api-logs');
      const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
      
      // Configure the logger provider
      const loggerProvider = new LoggerProvider({
        resource: new Resource({
          [SemanticResourceAttributes.SERVICE_NAME]: 'point-blank-website',
          [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
        }),
      });
  
      // Add the OTLP exporter for logs
      const logExporter = new OTLPLogExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
      });
  
      // Use the exporter for log processing
      loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(logExporter));
      logs.setGlobalLoggerProvider(loggerProvider);
  
      // Configure OpenTelemetry SDK
      const sdk = new NodeSDK({
        resource: new Resource({
          [SemanticResourceAttributes.SERVICE_NAME]: 'point-blank-website',
          [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
        }),
        traceExporter: new OTLPTraceExporter({
          url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
        }),
        instrumentations: [getNodeAutoInstrumentations()]
      });
  
      // Start the SDK
      sdk.start();
    }
  }