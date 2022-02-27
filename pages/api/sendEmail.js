const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const GMAIL = process.env.HIGHLANDER_GMAIL;
const GMAIL_PASS = process.env.HIGHLANDER_GMAIL_PASSWORD;
const transporter = nodemailer.createTransport(
  smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: GMAIL,
      pass: GMAIL_PASS,
    },
  })
);

export default async function handler(req, res) {
  const { name, email } = req.body;
  console.log(name, email);
  const mailOptions = {
    from: GMAIL,
    to: email,
    subject: 'Your Hardware Request - Highlander Engineering',
    text: `Hello ${name},\n\nWe have received your request, please wait for a confirmation email for you to pickup\n\n<More instructions goes here>`,
  };
  await transporter.sendMail(mailOptions, function (error, info) {
    if (!error) {
      return res.status(200).json({ status: 'Email sent' });
    } else {
      console.log(error);
      return res.status(500).json({ status: 'Error' });
    }
  });
}
