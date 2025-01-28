import { SwaggerOptions } from "swagger-jsdoc";

const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Title",
      version: "1.0.0",
      description: "API Documentation for your project",
    },
    servers: [
      {
        url: "http://localhost:3000", // Update with your local server URL
        description: "Development server",
      },
    ],
  },
  apis: ["route.ts"], // Specify the path to your route files
};

export default swaggerOptions;
