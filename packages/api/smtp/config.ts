const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_KEY } = process.env;

if (
  typeof SMTP_HOST !== 'string' ||
  typeof SMTP_PORT !== 'string' ||
  typeof SMTP_USER !== 'string' ||
  typeof SMTP_KEY !== 'string'
) {
  console.error('Missing SMTP configuration');
  process.exit(1);
}

const parsedPort = Number.parseInt(SMTP_PORT);

if (Number.isNaN(parsedPort)) {
  console.error('Invalid SMTP port');
  process.exit(1);
}

export const host = SMTP_HOST;
export const port = parsedPort;
export const user = SMTP_USER;
export const pass = SMTP_KEY;
