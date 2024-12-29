import transport from "../config/mailConfig";

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
): Promise<void> => {
  await transport.sendMail({
    from: '"GiftSync" <noreply@giftsync.fr>',
    to,
    subject,
    html,
  });
};
