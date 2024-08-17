var nodemailer = require('nodemailer');

async function send() {
    let testEmailAccount = await nodemailer.createTestAccount();
    console.log(testEmailAccount)
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testEmailAccount.user,
            pass: testEmailAccount.pass,
        },
    });

    let result = await transporter.sendMail({
        from: '"Node js" <nodejs@example.com>',
        to: 'hodziboevzohid@gmail.com',
        subject: 'Message from Node js',
        text: 'This message was sent from Node js server.',
        html:
            'This <i>message</i> was sent from <strong>Node js</strong> server.',
    });

    console.log(result);
}

send()

