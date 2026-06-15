import { MailerSend, EmailParams, Sender } from 'mailersend';

export const sendResetEmail = async (email: string, token: string) => {
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
  });

  const resetLink = `https://fullstack-anton.pp.ua/reset-password?token=${token}`;

  const sentEmailParams: EmailParams = {
    from: {
      email: 'mailings@test-51ndgwv9nkdlzqx8.mlsender.net',
      name: 'Trello Clone',
    },
    to: [
      {
        email: email,
      },
    ],
    subject: 'Відновлення пароля',
    html: `<p>Ви запросили відновлення пароля. Використовуйте наступне посилання: <a href="${resetLink}">Відновити пароль</a></p><p>Якщо ви цього не робили, просто ігноруйте цей лист.</p>`,
  };

  try {
    await mailerSend.email.send(sentEmailParams);
    return { result: 'Sent' };
  } catch (error) {
    console.error('MailerSend Error:', error);
    throw error;
  }
};
