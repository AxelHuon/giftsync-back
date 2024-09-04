
const nodemailer = require("nodemailer");
require('dotenv').config();

const password = process.env.PASSWORD_MAIL_TRAP;
if (!password) {
  throw new Error("PASSWORD_MAIL_TRAP is required");
}
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4e70b92624ec02",
    pass: process.env.PASSWORD_MAIL_TRAP,
  },
});


export default transport;
