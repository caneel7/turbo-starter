import { z } from '@hono/zod-openapi';
export const UserParamSchema = z.object({
  id: z.string().openapi({ example: 'clx1234' })
}).openapi('UserParam');

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  createdAt: z.date()
}).openapi('User');

export type UserType = z.infer<typeof UserSchema>;

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional()
}).openapi('UpdateUser');

export const ListUsersQuerySchema = z.object({
  limit: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Limit must be a positive number'
  }).transform(val => Number(val)),
  page: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Page must be a positive number'
  }).transform(val => Number(val))
}).openapi('ListUsersQuery');

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;