import { createRoute,  HonoOpenAPIApp,  z } from "@turbo-starter/services";

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
      title: 'Boyd Supply Management API',
      description: 'RESTful API built with Hono on Cloudflare Workers',
    },
    servers: [
      {
        url: 'api.scmthermalva.in',
        description: 'Production Server',
      },
      {
        url: 'api-dev.scmthermalva.in',
        description: 'Development Server',
      },
      {
        url: 'api-staging.scmthermalva.in',
        description: 'Staging Server',
      },
      {
        url: 'http://localhost:9000',
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
