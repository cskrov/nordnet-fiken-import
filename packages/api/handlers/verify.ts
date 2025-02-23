import type { CustomRequest } from '@api/custom-request/types';
import { db } from '@api/db/db';
import { type UserInsert, usersTable } from '@api/db/schema';
import { respond, respondJson } from '@api/handlers/helpers';
import { verifySignupRequest } from '@api/helpers/signup-request';
import { VERIFICATION_CODE_LENGTH } from '@shared/constants';
import { z } from 'zod';

const verifySchema = z.object({
  orgNumber: z.string().length(9),
  verificationCode: z
    .string()
    .regex(/\d+/, { message: 'Must only contain digits' })
    .length(VERIFICATION_CODE_LENGTH, 'Must be exactly 6 digits'),
});

export const verifyHandler = async (req: CustomRequest): Promise<Response> => {
  const body = await req.raw.json();
  const result = await verifySchema.safeParseAsync(body);

  if (!result.success) {
    return respondJson({ result: false, code: 'invalid_request', errors: result.error.errors }, 400);
  }

  const { orgNumber, verificationCode } = result.data;

  const signupData = await verifySignupRequest(orgNumber, verificationCode);

  // No signup request found.
  if (signupData === null) {
    return respondJson({ result: false }, 400);
  }

  const { password, recoveryEmail } = signupData;
  const user: UserInsert = { orgNumber, password, recoveryEmail };

  const [insertedUser] = await db.insert(usersTable).values(user).returning({ userId: usersTable.id });

  if (insertedUser === undefined) {
    console.error('Failed to insert user', { user: user });

    // TODO: Resend verification email?
    // TODO: Implement retry logic?

    return respond('Internal server error', 500);
  }

  return respondJson({ result: true, userId: insertedUser.userId }, 200);
};
