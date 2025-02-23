import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/*
  PostgreSQL automatically creates a unique index when a unique constraint or primary key is defined for a table.
  The index covers the columns that make up the primary key or unique constraint (a multicolumn index, if appropriate),
  and is the mechanism that enforces the constraint.

  https://www.postgresql.org/docs/current/indexes-unique.html
*/

const createdAt = timestamp().notNull().defaultNow();
const deletedAt = timestamp();
const modifiedAt = timestamp()
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());
const baseFields = { createdAt, deletedAt };

const id = () =>
  text()
    .$default(() => crypto.randomUUID())
    .primaryKey();

const commonUserFields = {
  recoveryEmail: text(), // One person could manage multiple organizations.
  password: text().notNull(),
};

export const usersTable = pgTable(
  'users',
  {
    id: id(),
    orgNumber: text().notNull().unique(), // One organization has one organization ID.
    ...baseFields,
    ...commonUserFields,
    modifiedAt,
  },
  (table) => [index().on(table.recoveryEmail)],
);

export type UserSelect = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;
export type PublicUser = Omit<UserSelect, 'password'>;

// export const signupRequestsTable = pgTable(
//   'signup_requests',
//   {
//     id: id(),
//     orgNumber: text().notNull(),
//     ...commonUserFields,
//     sentTo: text().notNull(), // Email used to send the verification code.
//     verificationCode: text().notNull(), // Code to verify the Fiken account.
//     failedAttempts: integer().notNull().default(0),
//     ...baseFields,
//   },
//   (table) => [index().on(table.orgNumber), index().on(table.createdAt)],
// );

// export type SignupRequestSelect = typeof signupRequestsTable.$inferSelect;
// export type SignupRequestInsert = typeof signupRequestsTable.$inferInsert;

export const sessionsTable = pgTable(
  'sessions',
  {
    id: id(),
    userId: text()
      .notNull()
      .references(() => usersTable.id), // One user may have multiple sessions.
    token: text().notNull().unique(),
    lastActiveAt: timestamp().notNull().defaultNow(),
    browser: text().notNull(),
    os: text().notNull(),
    ip: text(),
    createdAt,
    deletedAt,
  },
  (table) => [index().on(table.userId), index().on(table.lastActiveAt)],
);

export type SessionSelect = typeof sessionsTable.$inferSelect;
export type SessionInsert = typeof sessionsTable.$inferInsert;
export type PublicSession = Omit<SessionSelect, 'userId' | 'token'>;
