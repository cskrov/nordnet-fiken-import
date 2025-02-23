const APPLICATION_JSON = { 'Content-Type': 'application/json' };

export const respondJson = <T extends object>(body: T, status = 200, headers?: Record<string, string>) =>
  respond(JSON.stringify(body), status, { ...headers, ...APPLICATION_JSON });

const TEXT_PLAIN = { 'Content-Type': 'text/plain' };

export const respond = (body: string, status = 200, headers: Record<string, string> = TEXT_PLAIN) =>
  new Response(body, { headers, status });
