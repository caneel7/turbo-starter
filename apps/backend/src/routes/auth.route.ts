import { auth, Hono } from '@turbo-starter/services';

const authRoute = new Hono();

authRoute.on(['GET', 'POST'], '/**', async (c) => {
  return await auth.handler(c.req.raw)
});

export default authRoute;
