import type { CustomRequest } from '@api/custom-request/types';
import { UAParser } from 'ua-parser-js';

interface UserDevice {
  browser: string;
  os: string;
}

export const getUserDevice = (req: CustomRequest): UserDevice | null => {
  const { browser, os } = UAParser(req.userAgent ?? undefined);

  // Handle invalid user agents.
  if (
    os.name === undefined ||
    os.version === undefined ||
    browser.name === undefined ||
    browser.version === undefined
  ) {
    console.warn('Invalid user agent', req.userAgent);

    return null;
  }

  return {
    browser: `${browser.name} ${browser.version}`,
    os: `${os.name} ${os.version}`,
  };
};
