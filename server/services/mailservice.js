const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API, domain: 'cardsagainst.me', host: "api.eu.mailgun.net" });

class MailService {
    send(to, from, subject, text, html) {
        let data = {
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html
        }

        mailgun.messages().send(data, (err, body) => {
            if (err) console.error(err)
        })
    }
}

module.exports = MailService;