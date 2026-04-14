import { createRoute } from '@/config/openapi.config';
import { ErrorSchema, HonoOpenAPIApp, ListUsersQuerySchema, UserParamSchema, UserSchema, UserService } from '@turbo-starter/services';
import { db } from '@turbo-starter/database';
import { verifySession } from '@/middlewares/verify.session.middleware';

export const userRoutes = new HonoOpenAPIApp();

userRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Users'],
    middleware: [verifySession()],
    request: { params: UserParamSchema },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: UserSchema
          }
        },
        description: 'User found'
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorSchema
          }
        },
        description: 'Not found'
      }
    }
  }),
  async (c) => {
    let { id } = c.req.valid('param');
    const user = await new UserService(db).findUserById(id);
    return c.json(user, 200)
  }
);

userRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Users'],
    middleware: [verifySession()],
    request: { query: ListUsersQuerySchema },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: UserSchema.array()
          }
        },
        description: 'User found'
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorSchema
          }
        },
        description: 'Not found'
      }
    }
  }),
  async (c) => {
    console.log(c.req.raw.headers);
    let { limit, page  } = c.req.valid('query');
    const user = await new UserService(db).listUsers(limit, page);
    return c.json(user, 200)
  }
);

export default userRoutes;
