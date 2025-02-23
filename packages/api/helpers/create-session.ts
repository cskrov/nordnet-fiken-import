import type { CustomRequest } from '@api/custom-request/types';
import type { SessionInsert } from '@api/db/schema';
import { generateSessionToken } from '@api/helpers/session';
import { getUserDevice } from '@api/helpers/user-agent';

export const createSessionData = (req: CustomRequest, userId: string): SessionInsert => {
  const userDevice = getUserDevice(req);

  return {
    userId,
    token: generateSessionToken(),
    browser: userDevice?.browser ?? '',
    os: userDevice?.os ?? '',
    ip: req.ip,
  };
};
