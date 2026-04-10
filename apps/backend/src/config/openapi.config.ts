import { createRoute, HonoOpenAPIApp, z } from "@turbo-starter/services";

/**
 * Create an OpenAPI-enabled Hono app
 */
export function createOpenAPIApp() {
  const app = new HonoOpenAPIApp();

  app.openAPIRegistry.registerComponent('securitySchemes', 'BearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  // OpenAPI documentation route
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'API',
      description: 'RESTful API built with Hono on Cloudflare Workers',
    },
    servers: [
      {
        url: process.env.DEPLOYMENT_URL || 'http://localhost:3000',
        description: 'Deployment Server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Local Server',
      },
    ],
    security: [
      {
        BearerAuth: [],
      },
    ],
  });

  return app;
}

/**
 * Helper function to create OpenAPI routes
 */
export { createRoute, z };
