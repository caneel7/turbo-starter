import { OpenAPIHono } from '@hono/zod-openapi';
import { AppError } from '@/classes/errors';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { ZodError } from 'zod';
import { z } from '@hono/zod-openapi';

export * from '@/modules/auth'
export * from '@/modules/users'
export * from '@/modules/emails/email.service';
export { logger } from 'hono/logger';
export { cors } from 'hono/cors';

export class HonoOpenAPIApp extends OpenAPIHono {

    constructor () {
        super();

        this.onError((err, c) => {
            if(err instanceof AppError) {
                return c.json({
                    message: err.message,
                    statusCode: err.statusCode,
                },err.statusCode as ContentfulStatusCode )
            }else if(err instanceof ZodError) {
                return c.json({
                    error: 'Validation failed',
                    statusCode: 400,
                    details: JSON.parse(err.message)
                }, 400 as ContentfulStatusCode)
            }else{
                return c.json({
                    error: 'Internal server error',
                    statusCode: 500,
                }, 500 as ContentfulStatusCode)
            }
        })
    }

}

export const ErrorSchema = z.object({
    statusCode: z.number(),
    details: z.string().optional(),
    message: z.string().optional()
});

export { createRoute,z } from '@hono/zod-openapi';
