import process from "node:process";

var nodemailer = require("nodemailer");
export const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4e70b92624ec02",
    pass: process.env.PASSWORD_MAIL_TRAP,
  },
});
