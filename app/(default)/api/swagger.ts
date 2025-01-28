// app/(default)/api/swagger.ts
import { createSwaggerSpec } from 'next-swagger-doc';

const apiConfig = {
  openapi: "3.0.0",
  info: {
    title: "Leads API",
    version: "1.0.0",
    description: "API Documentation for Leads Management"
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'development' 
        ? "http://localhost:3000"
        : "your-production-url",
      description: "Development server"
    }
  ],
  // Import your paths from swagger.json
  paths: {
    "/api/leads": {
      get: {
        summary: "Get all leads",
        responses: {
          "200": {
            description: "Successful response"
          },
          "500": {
            description: "Server error"
          }
        }
      },
      post: {
        summary: "Add a new lead",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  position: { type: "string" },
                  organization: { type: "string" },
                  additionalInfo: { type: "string" },
                  imageUrl: { type: "string" }
                },
                required: ["name", "position", "organization", "imageUrl"]
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Lead created successfully"
          },
          "400": {
            description: "Validation error"
          }
        }
      }
    }
  }
};

export const getApiDocs = () => {
  return createSwaggerSpec({
    definition: apiConfig,
    apiFolder: 'app/(default)/api'
  });
};