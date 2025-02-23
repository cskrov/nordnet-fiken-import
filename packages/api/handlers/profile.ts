import type { CustomRequest } from '@api/custom-request/types';
import { db } from '@api/db/db';
import { sessionsTable, usersTable } from '@api/db/schema';
import { respond, respondJson } from '@api/handlers/helpers';
import { verifySession } from '@api/helpers/session';
import { eq } from 'drizzle-orm';

export const profileHandler = async (req: CustomRequest): Promise<Response> => {
  const { session } = req;

  const verifyStart = performance.now();
  if (session === undefined || !verifySession(session)) {
    req.addTiming('verify', verifyStart, 'Session verification');
    return respond('Unauthorized', 401);
  }

  const sessionDbStart = performance.now();
  const [sessionData] = await db.select().from(sessionsTable).where(eq(sessionsTable.token, session)).limit(1);
  req.addTiming('db', sessionDbStart, 'Session data');

  if (sessionData === undefined) {
    return respond('Unauthorized', 401);
  }

  const userDbStart = performance.now();

  const [user] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      createdAt: usersTable.createdAt,
      modifiedAt: usersTable.modifiedAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, sessionData.userId))
    .limit(1);

  req.addTiming('db', userDbStart, 'User data');

  if (user === undefined) {
    return respond('Unauthorized', 401);
  }

  return respondJson(user);
};
