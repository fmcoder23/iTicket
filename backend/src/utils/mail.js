const nodemailer = require('nodemailer');
const { config } = require('../../config');

let configOptions = {
    host: config.mailHost,
    port: config.mailPort,
    secure: false,
    auth: {
        user: config.mailUser,
        pass: config.mailPass,
    }
}

const transporter = nodemailer.createTransport(configOptions);

async function sendMail(to, code) {
    const info = await transporter.sendMail({
        from: config.mailUser,
        to,
        subject: "Your Confirmation Code",
        text: `Your confirmation code is ${code}`,
        html: `Your confirmation code is <b>${code}</b>`,
    })
}

async function sendVerMail(to) {
    const info = await transporter.sendMail({
        from: config.mailUser,
        to,
        subject: "Your email has been verified",
        text: "Congratulations! \n\n Your email has been verified!",
        html: `<b>Congratulations!</b> <br><br> Your email has been verified!`,
    })
}

async function sendResetPass(to) {
    const info = await transporter.sendMail({
        from: config.mailUser,
        to,
        subject: "Link to reset your password",
        text: "Here is the link to rest your password: \n \n Click",
        html: `Here is the link to reset your password <br><br> <a href="https://kun.uz">Click</a>`,
    })
}

module.exports = { sendMail, sendVerMail, sendResetPass };