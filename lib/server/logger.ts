import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact:{
    paths:[
      "password",
      "token",
      "authorization",
      "req.headers.authorization",
      "cookie",
      "cookies",
      "session"
    ],
    censor: "[REDACTED]",
  },
  base: {
    service: "pb-website",
    env: process.env.NODE_ENV || "development",
  },
});

export default logger;