import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { createOpenAPIApp } from '@/config/openapi.config';
import { registerRoutes } from '@/routes/index';
import { cors, logger } from '@turbo-starter/services';

const app = createOpenAPIApp();

app.use('*', logger())
const allowedOrigins = [
  process.env.FRONTEND_ENDPOINT || 'http://localhost:5173',
  process.env.BASE_URL || 'http://localhost:3000',
];

app.use(
  '*',
  cors({
    origin: (origin) => allowedOrigins.includes(origin) ? origin : null,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

registerRoutes(app);

app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Welcome to API!',
    version: '1.0.0',
    docs: '/docs',
  });
});

app.get('/swagger', swaggerUI({ url: '/doc' }));

app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000
}, (info) => {
  console.log(`Server running on http://localhost:${info.port}`)
  console.log(`Docs available at http://localhost:${info.port}/docs`)
})
