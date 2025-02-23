import type { CustomRequest } from '@api/custom-request/types';
import { db } from '@api/db/db';
import { type UserInsert, usersTable } from '@api/db/schema';
import { respond, respondJson } from '@api/handlers/helpers';
import { hasVerifiedVerificationRequest } from '@api/helpers/signup-request';
import { getUserByOrgNumber } from '@api/helpers/user';
import { VERIFICATION_CODE_LENGTH } from '@shared/constants';

interface CreateUserParams {
  orgNumber: string;
  password: string;
}

export const verifyHandler = async (req: CustomRequest): Promise<Response> => {
  const { orgNumber, password } = (await req.raw.json()) as CreateUserParams;
  const isValid =
    typeof orgNumber === 'string' &&
    typeof password === 'string' &&
    orgNumber.length !== 9 &&
    password.length !== VERIFICATION_CODE_LENGTH;

  if (!isValid) {
    return respond('Invalid request', 400);
  }

  const isVerified = await hasVerifiedVerificationRequest(orgNumber);

  if (!isVerified) {
    console.warn('No verified verification request found', orgNumber);

    return respondJson({ result: false }, 401);
  }

  const existingUser = await getUserByOrgNumber(orgNumber);

  if (existingUser === undefined) {
    console.warn('User not found', orgNumber);

    return respondJson({ result: false }, 401);
  }

  const passwordHash = await Bun.password.hash(password);

  const user: UserInsert = { orgNumber, password: passwordHash };
  const [insertedUser] = await db.insert(usersTable).values(user).returning({ userId: usersTable.id });

  if (insertedUser === undefined) {
    console.error('Failed to insert user', user);

    return respond('Internal server error', 500);
  }

  return respondJson({ result: true }, 201);
};
