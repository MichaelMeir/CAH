const jwt = require('jsonwebtoken')
const fs = require('fs')
const { signedCookie } = require('cookie-parser')

const cookieSecret = fs.readFileSync('private.key').toString()
const publicKey = fs.readFileSync('server.cert', 'utf8').toString()

module.exports = async (req, callback, db = null, models = null, ip = null) => {
    if(req && req.signedCookies && req.signedCookies.jwt) {
        return validate(req.connection.remoteAddress, req.db, req.models, req.signedCookies.jwt, callback)
    }else if(req) {
        if(typeof req == "string") {
            if(!/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/gm.exec(req)) {
                req = signedCookie(req, cookieSecret)
            }
            const result = await validate(ip, db, models, req, callback)
            return result
        }else{
            return callback(false, "jwt cookie was expected to be a string")
        }
    } else {
        return callback(false, "no jwt cookie has been supplied")
    }
}

function validate(ip, db, models, token, callback) {
    let decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
    if(decoded) {
        let uuid = decoded.uuid;
        return new Promise((resolve) => {
            db.sync((err) => {
                if (err) {
                     resolve(callback(false, err))
                }
                return models.user.find({ session_id: uuid, session_ip: ip }, (err, results) => {
                    if (err) {
                        resolve(callback(false, err))
                    }
                    if(results.length > 0) {
                        resolve(callback(results[0]))
                    }else{
                        resolve(callback(false, "no matching user found"))
                    }
                });
            });
        })
    }else{
        return callback(false, "could not verify jwt cookie")
    }
}