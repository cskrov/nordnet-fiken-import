import type { Handler } from '@api/custom-request/types';
import { respond } from '@api/handlers/helpers';
import type { Server } from 'bun';

export const customRequestMiddleware =
  (handler: Handler) =>
  async (req: Request, server: Server): Promise<Response> => {
    const start = performance.now();
    const serverTiming: string[] = [];
    const { url, method } = req;

    if (!URL.canParse(url)) {
      setTotalTime(start, serverTiming);

      return respond('Invalid URL', 400);
    }

    const { pathname, searchParams } = new URL(url);

    const cookies = getCookies(req);
    const addTiming = getAddTiming(serverTiming);
    const userAgent = req.headers.get('user-agent');

    const res = await handler({
      raw: req,
      method,
      path: pathname,
      query: searchParams,
      start,
      serverTiming,
      cookies,
      user: null,
      session: cookies.session,
      ip: server.requestIP(req)?.address,
      userAgent,
      addTiming,
    });

    const total = addTiming('total', start, 'Total request time');

    console.info(`${method} ${pathname} ${res.status} - ${total}ms`);

    res.headers.set('Server-Timing', serverTiming.join(', '));

    return res;
  };

const getAddTiming =
  (serverTiming: string[]) =>
  (name: string, startTime: number, description?: string): string => {
    const dur = duration(startTime);

    serverTiming.push(`${name};dur=${dur}${description ? `;desc="${description}"` : ''}`);

    return dur;
  };

const getCookies = (req: Request): Record<string, string> => {
  const cookieHeader = req.headers.get('cookie');

  if (cookieHeader === null) {
    return {};
  }

  return Object.fromEntries(cookieHeader.split(';').map((c) => c.split('=')));
};

const setTotalTime = (start: number, serverTiming: string[]) => {
  const total = duration(start);
  serverTiming.push(`total;dur=${total};desc="Total request time"`);

  return total;
};

const duration = (start: number) => (performance.now() - start).toFixed(2);
