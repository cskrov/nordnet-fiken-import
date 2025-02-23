import { getEnv } from '@api/env';
import { MAX_FAILED_ATTEMPTS, VERIFICATION_CODE_TTL } from '@shared/constants';
import { createClient } from 'redis';
import { z } from 'zod';

const createSignupRequestSchema = z.object({
  verificationCode: z.string(),
  recoveryEmail: z.string().email().optional(),
  password: z.string(),
});

type SignupRequest = z.infer<typeof createSignupRequestSchema>;

const signupRequestSchema = createSignupRequestSchema.extend({
  failedAttempts: z.number().min(0).max(MAX_FAILED_ATTEMPTS).default(0),
});

const valkeyClient = await createClient({ url: getEnv('VALKEY_URL') })
  .on('error', console.error)
  .connect();

export const verifySignupRequest = async (
  orgNumber: string,
  verificationCode: string,
): Promise<SignupRequest | null> => {
  const key = createKey(orgNumber);
  const data = await valkeyClient.hGetAll(key);

  const signupRequest = await signupRequestSchema.safeParseAsync(data);

  if (!signupRequest.success) {
    console.error('Invalid signup request data', { orgNumber, data });
    await valkeyClient.del(key);

    return null;
  }

  // Check if the signup request has too many failed attempts already. Should not be possible.
  if (signupRequest.data.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    console.warn('Max failed attempts reached', { orgNumber });
    await valkeyClient.del(key);

    return null;
  }

  if (signupRequest.data.verificationCode !== verificationCode) {
    if (signupRequest.data.failedAttempts === MAX_FAILED_ATTEMPTS - 1) {
      console.warn('Max failed attempts reached', { orgNumber });
      await valkeyClient.del(key);

      return null;
    }

    await valkeyClient.hIncrBy(key, 'failedAttempts', 1);

    return null;
  }

  console.info('Signup request verified', { orgNumber });

  await valkeyClient.del(key);

  return signupRequest.data;
};

export const hasSignupRequest = async (orgNumber: string): Promise<boolean> => {
  const key = createKey(orgNumber);

  try {
    const exists = await valkeyClient.exists(key);

    return exists === 1;
  } catch (error) {
    console.error('Failed to check if signup request exists', { orgNumber, error });

    return false;
  }
};

export const createSignupRequest = async (orgNumber: string, data: SignupRequest): Promise<boolean> => {
  const key = createKey(orgNumber);

  try {
    await valkeyClient.multi().hSet(key, data).expire(key, VERIFICATION_CODE_TTL).exec();

    return true;
  } catch (error) {
    console.error('Failed to create signup request', { orgNumber, error });
    await valkeyClient.del(key);

    return false;
  }
};

export const deleteSignupRequest = async (orgNumber: string): Promise<boolean> => {
  try {
    await valkeyClient.del(createKey(orgNumber));

    return true;
  } catch (error) {
    console.error('Failed to delete signup request', { orgNumber, error });

    return false;
  }
};

const createKey = (orgNumber: string) => `signup-request-${orgNumber}`;
