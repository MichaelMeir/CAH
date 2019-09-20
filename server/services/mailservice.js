const sendgrid = require('@sendgrid/mail');

class MailService {

    send(to, from, subject, text, html) {
        sendgrid.setApiKey(process.env.SENDGRID_API);

        sendgrid.send({
            to: to,
            from: from,
            subject: subject,
            text: text,
            html: html
        });
    }

}

module.exports = MailService;