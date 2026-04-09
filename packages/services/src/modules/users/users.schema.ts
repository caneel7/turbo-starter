import { z } from '@hono/zod-openapi';
export const UserParamSchema = z.object({
  id: z.string().openapi({ example: 'clx1234' })
}).openapi('UserParam');

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  createdAt: z.string()
}).openapi('User');

export type UserType = z.infer<typeof UserSchema>;

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional()
}).openapi('UpdateUser');

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;