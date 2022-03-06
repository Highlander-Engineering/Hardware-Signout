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
  const { name, email, data, school, role } = req.body;
  const buildList = () => {
    let res = '';
    Object.keys(data).forEach((key) => (res += `${key}: ${data[key]}\n`));
    return res;
  };
  const mailOptions = {
    from: GMAIL,
    to: email,
    subject: 'Your Hardware Request - Highlander Engineering Challenge',
    text: `Hello ${name},\n\nWe have received your request, please wait for a confirmation email for you to pickup\n\nSchool: ${school}, ${role}\n\nYour Request: \n\n${buildList()}\n\n - Highlander Engineering Challenge`,
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
