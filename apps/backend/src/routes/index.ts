import userRoute from '@/routes/user.route';
import authRoute from '@/routes/auth.route';
import { HonoOpenAPIApp } from '@turbo-starter/services';

export const registerRoutes = (app: HonoOpenAPIApp) => {
  app.route('/api/v1/auth', authRoute)
  app.route('/api/v1/users', userRoute);
  return app;
};
