import { z } from 'zod'
import { createRoute } from '@/config/openapi.config';
import { ErrorSchema, HonoOpenAPIApp, UserParamSchema, UserSchema, UserService } from '@turbo-starter/services';
import { db } from '@turbo-starter/database';

export const userRoutes = new HonoOpenAPIApp();

userRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Users'],
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

export default userRoutes;
