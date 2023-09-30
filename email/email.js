const nodemailer = require('nodemailer');

// Create a transporter with your SMTP configuration

const transporter = nodemailer.createTransport({
    host: 'panosgio.org',
    port: 465,
    secure: true, // false for TLS - as a boolean not string
    auth: {
        user: 'rento@panosgio.org',
        pass: '4Hk29nk1$'
    }
});
module.exports = {
    transporter: transporter
};