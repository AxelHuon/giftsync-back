import transport from "../mailConfig/mailConfig";

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
): Promise<void> => {
  await transport.sendMail({
    from: "noreply@giftsync.fr",
    to,
    subject,
    html,
  });
};
