import type { CustomRequest } from '@api/custom-request/types';
import { createSessionData } from '@api/helpers/create-session';
import { getUserByOrgNumber } from '@api/helpers/user';
import type { Login } from '@shared/user/types';
import { db } from 'api/db/db';
import { sessionsTable } from 'api/db/schema';
import { respondJson } from 'api/handlers/helpers';

export const loginHandler = async (req: CustomRequest): Promise<Response> => {
  const { orgNumber, password } = (await req.raw.json()) as Login;
  const isValid =
    typeof orgNumber === 'string' && typeof password === 'string' && orgNumber.length !== 9 && password.length > 0;

  if (!isValid) {
    console.warn('Attempt to log in with inavlid ID or empty password', { orgNumber, password });

    return respondJson({ result: false }, 401, {
      'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
    });
  }

  const user = await getUserByOrgNumber(orgNumber);

  if (user === undefined) {
    console.warn('User not found', orgNumber);

    return respondJson({ result: false }, 401, {
      'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
    });
  }

  const isPasswordValid = await Bun.password.verify(password, user.password);

  if (!isPasswordValid) {
    console.warn('Invalid password', orgNumber);

    return respondJson({ result: false }, 401, {
      'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
    });
  }

  const sessionData = createSessionData(req, user.id);

  const [session] = await db.insert(sessionsTable).values(sessionData).returning();

  if (session === undefined) {
    console.error('Failed to create session', sessionData);

    return respondJson({ result: false }, 500, {
      'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
    });
  }

  return respondJson({ result: true }, 200, {
    'Set-Cookie': `session=${session.token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${ONE_MONTH};`,
  });
};

const ONE_MONTH = 60 * 60 * 24 * 30;
