import { MailerSend } from 'mailersend';

export const sendResetEmail = async (email: string, token: string) => {
  
  const apiKey = process.env.MAILERSEND_API_KEY;
  if (!apiKey) {
    throw new Error('MailerSend API key is missing');
  }

  const mailerSend = new MailerSend({
    apiKey: apiKey,
  });

  const resetLink = `https://koskovtsev.github.io/trello/#/forgot-password-reset?token=${token}`;

  // Використовуємо any для параметрів, щоб уникнути конфліктів з типами бібліотеки, 
  // оскільки структура об'єкта відповідає API MailerSend
  const sentEmailParams: any = {
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
    const response = await mailerSend.email.send(sentEmailParams);
    return { result: 'Sent' };
  } catch (error: any) {
    throw error;
  }
};
