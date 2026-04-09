import { Hono } from 'hono'
import { auth } from '@turbo-starter/services'

const authRoute = new Hono()

authRoute.on(['GET', 'POST'], '/**', async (c) => {
  return await auth.handler(c.req.raw)
})

export default authRoute;