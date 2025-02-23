import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { getEnv } from 'api/env';

const SESSION_SECRET = getEnv('SESSION_SECRET');

export const generateSessionToken = (): string => {
  const id = randomBytes(64).toString('base64url');
  const signature = createHmac('sha256', SESSION_SECRET).update(id).digest('base64url');

  return `${id}.${signature}`;
};

export const verifySession = (session: string): boolean => {
  const [id, signature] = session.split('.');

  if (id === undefined || signature === undefined) {
    return false;
  }

  const expectedSignature = Uint8Array.from(createHmac('sha256', SESSION_SECRET).update(id).digest());
  const actualSignature = Uint8Array.from(Buffer.from(signature, 'base64url'));

  if (expectedSignature.length !== actualSignature.length) {
    return false;
  }

  return timingSafeEqual(expectedSignature, actualSignature);
};
