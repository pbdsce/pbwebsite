import { createSwaggerSpec } from 'next-swagger-doc';
export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Next.js API Documentation',
      version: '1.0.0',
      description: 'API documentation for the application endpoints',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'https://pointblank.club',
        description: 'Production server',
      },
      {
        url: process.env.NEXT_PUBLIC_STAGING_URL || 'https://staging--pbpage.netlify.app/',
        description: 'Staging server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      }
    ],
    tags: [
      { name: 'Achievements', description: 'Achievements management endpoints' },
      { name: 'Admin', description: 'Administrative endpoints' },
      { name: 'Credits', description: 'Credit management endpoints' },
      { name: 'Events', description: 'Event management endpoints' },
      { name: 'Hustle', description: 'Hustle and leaderboard related endpoints' },
      { name: 'Leads', description: 'Lead management endpoints' },
      { name: 'Members', description: 'Member data management endpoints' },
      { name: 'Registration', description: 'Registration related endpoints' },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './app/(default)/api/achievements/route.ts',
    './app/(default)/api/admin/route.ts',
    './app/(default)/api/credits/**/route.ts',
    './app/(default)/api/events/route.ts',
    './app/(default)/api/hustle/**/route.ts',
    './app/(default)/api/leads/**/route.ts',
    './app/(default)/api/membersData/**/route.ts',
    './app/(default)/api/registration/**/route.ts',
  ],
};
export const getApiDocs = async () => {
  return createSwaggerSpec(swaggerOptions);
};