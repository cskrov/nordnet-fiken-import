import type { CustomRequest } from '@api/custom-request/types';
import { db } from '@api/db/db';
import { usersTable } from '@api/db/schema';
import { respondJson } from '@api/handlers/helpers';
import { generateVerificationCode } from '@api/helpers/code';
import { createSignupRequest, deleteSignupRequest, hasSignupRequest } from '@api/helpers/signup-request';
import { eq } from 'drizzle-orm';
import { getOrg } from 'shared/brreg/get';
import { formatFikenEmail } from 'shared/fiken/email';
import { z } from 'zod';

const signupSchema = z
  .object({
    orgNumber: z
      .string({
        required_error: 'org_number_required',
        invalid_type_error: 'org_number_invalid',
        message: 'org_number_invalid',
      })
      .min(9)
      .max(9),
    password: z
      .string({
        required_error: 'password_required',
        invalid_type_error: 'password_invalid',
        message: 'password_invalid',
      })
      .min(8, { message: 'password_too_short' })
      .max(100, { message: 'password_too_long' }),
    recoveryEmail: z
      .string({ invalid_type_error: 'recovery_email_invalid' })
      .email({ message: 'recovery_email_invalid' })
      .optional(),
  })
  .readonly();

export const signupHandler = async (req: CustomRequest): Promise<Response> => {
  const params = await req.raw.json();

  const result = await signupSchema.safeParseAsync(params);

  if (!result.success) {
    return respondJson({ result: false, code: 'invalid_request', errors: result.error.errors }, 400);
  }

  const { orgNumber, password, recoveryEmail } = result.data;

  const organization = await getOrg(orgNumber);

  if (organization === null) {
    console.warn('Organization not found', orgNumber);

    return respondJson({ result: false, code: 'org_not_found' }, 400);
  }

  const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.orgNumber, orgNumber)).limit(1);

  // Existing user.
  if (existingUser !== undefined) {
    console.warn('Verification request for verified organization', orgNumber);

    return respondJson({ result: true, code: 'signup_request_created' }, 200);
  }

  const signupRequest = await hasSignupRequest(orgNumber);

  // Active verification request.
  if (signupRequest !== null) {
    console.warn('Verification request already exists', orgNumber);

    // Do not create a new verification request. User must wait until the existing request expires.
    return respondJson({ result: true, code: 'signup_request_created' }, 200);
  }

  // No active verification request.
  const verificationCode = generateVerificationCode();

  const signupRequestCreated = await createSignupRequest(orgNumber, {
    password: await Bun.password.hash(password),
    recoveryEmail,
    verificationCode,
  });

  if (!signupRequestCreated) {
    return respondJson({ result: false, code: 'internal_server_error' }, 500);
  }

  const fikenEmail = formatFikenEmail(organization.navn);

  try {
    // TODO: Send verification email.
    console.log('Sent verification email.', { fikenEmail, verificationCode });
  } catch (error) {
    console.error('Failed to send verification email', { fikenEmail, verificationCode, error });

    // Delete the signup request if email sending fails. In the background.
    deleteSignupRequest(orgNumber);

    return respondJson({ result: false, code: 'email_send_failed', data: { email: fikenEmail } }, 502);
  }

  return respondJson({ result: true, code: 'signup_request_created' }, 200);
};
