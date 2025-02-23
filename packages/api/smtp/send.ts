import { transporter } from 'api/smtp/transporter';

interface Params {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendMail = async ({ to, subject, text, html }: Params) => {
  try {
    const info = await transporter.sendMail({
      from: '"Nordnet Fiken Import" <no-reply@import.sourcecontrol.no>',
      to,
      subject,
      text,
      html,
      attachments: [
        {
          filename: 'test.csv',
          contentType: 'text/csv',
          content: 'a,b,c\n1,2,3\n4,5,6',
          contentDisposition: 'attachment',
        },
      ],
    });

    console.log('Message sent: %s', JSON.stringify(info, null, 2));
  } catch (error) {
    console.error('Failed to send email', error);
  }
};
