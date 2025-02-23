import { host, pass, port, user } from 'api/smtp/config';
import { createTransport } from 'nodemailer';

export const transporter = createTransport({
  host,
  port,
  auth: { user, pass },
  tls: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2',
  },
});

try {
  await transporter.verify();
} catch (error) {
  console.error('Failed to verify email transport', error);
  process.exit(1);
}
