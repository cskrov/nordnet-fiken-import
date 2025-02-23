import { customRequestMiddleware } from '@api/custom-request/middleware';
import type { CustomRequest, Handler } from '@api/custom-request/types';
import { loginHandler } from '@api/handlers/login';
import { profileHandler } from '@api/handlers/profile';
import { signupHandler } from '@api/handlers/signup';
import { verifyHandler } from '@api/handlers/verify';
import { respond } from 'api/handlers/helpers';

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
}

Bun.serve({
  port: 4000,
  maxRequestBodySize: 1024 * 1024, // 1 MB
  fetch: customRequestMiddleware(async (req) => {
    const { path, method } = req;

    if (method === HttpMethod.POST && path === '/api/signup' && isJsonRequest(req.raw)) {
      return signupHandler(req);
    }

    if (method === HttpMethod.POST && path === '/api/verify' && isJsonRequest(req.raw)) {
      return verifyHandler(req);
    }

    if (method === HttpMethod.POST && path === '/api/login' && isJsonRequest(req.raw)) {
      return loginHandler(req);
    }

    if (method === HttpMethod.GET && path === '/api/me') {
      return profileHandler(req);
    }

    return respond('Not found', 404);
  }),
});

type Middleware = (handler: Handler) => (req: CustomRequest) => Promise<Response>;

console.info('API started');

const isJsonRequest = (req: Request) => req.headers.get('content-type') === 'application/json';
