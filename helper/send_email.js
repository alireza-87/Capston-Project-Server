    const nodemailer = require('nodemailer');
    module.exports = sendEmail;

    async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM }) {
        const transporter =   nodemailer.createTransport({
            "host": process.env.HOST,
            "port":process.env.EMAIL_PORT,
            "auth":{
                "user": process.env.EMAIL_USER,
                "pass" : process.env.EMAIL_PASS
            },
            "tls": {
                "rejectUnauthorized": false
              }
        })
    await transporter.sendMail({ from, to, subject, html })
    }