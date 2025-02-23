import { db } from '@api/db/db';
import { type UserInsert, usersTable } from '@api/db/schema';
import { eq } from 'drizzle-orm';

export const getUserByOrgNumber = async (orgNumber: string) =>
  (await db.select().from(usersTable).where(eq(usersTable.orgNumber, orgNumber)).limit(1)).at(0);

export const insertUser = async (user: UserInsert) => {
  const [insertedUser] = await db.insert(usersTable).values(user).returning({ userId: usersTable.id });

  return insertedUser?.userId;
};
