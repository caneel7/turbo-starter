import { UnAuthorizedResponseMessage } from "@/config/response.messages.contants";
import { UnauthorizedException } from "@turbo-starter/services";
import { auth, MiddlewareHandler } from "@turbo-starter/services";

export const verifySession = (): MiddlewareHandler => {
    return async (c, next) => {
        let session = await auth.api.getSession({ 
            headers: c.req.raw.headers
        });

        if(!session){
            throw new UnauthorizedException(UnAuthorizedResponseMessage);
        }

        c.set('User',session.user);
        await next();
    }
};
