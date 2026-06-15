import { MailerSend } from 'mailersend';

export const sendResetEmail = async (email: string, token: string) => {
  const mailersend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
  });

  const resetLink = `https://fullstack-anton.pp.ua/reset-password?token=${token}`;
  
  try {
    const sent = await mailersend.email.send({
      from: { 
        email: 'mailings@send.fullstack-anton.pp.ua', 
        name: 'Trello Clone' 
      },
      to: [{ email }],
      subject: 'Відновлення пароля',
      html: `<p>Ви запросили відновлення пароля. Використовуйте наступне посилання: <a href="${resetLink}">Відновити пароль</a></p><p>Якщо ви цього не робили, просто ігноруйте цей лист.</p>`,
    });
    return sent;
  } catch (error) {
    console.error('MailerSend Error:', error);
    throw error;
  }
};
