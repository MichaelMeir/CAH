const jwt = require('jsonwebtoken')
const fs = require('fs')

const publicKey = fs.readFileSync('server.cert', 'utf8').toString()

module.exports = (req, callback, db = null, models = null, ip = null) => {
    if(req.signedCookies.jwt) {
        validate(req.connection.remoteAddress, req.db, req.models, req.signedCookies.jwt, callback)
    }else{
        if(req instanceof String) {
            if(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/gm.exec(req)) {
                validate(ip, db, models, req, callback)
            }else{
                callback(false)
                return
            }
        }else{
            callback(false)
            return
        }
    }
}

function validate(ip, db, models, token, callback) {
    let decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
        if(decoded) {
            let uuid = decoded.uuid;
            db.sync(function (err) {
                if (err) {
                     callback(false, err)
                     return
                }
                models.user.find({ session_id: uuid, session_ip: ip }, (err, results) => {
                    if (err) {
                        callback(false, err)
                        return
                    }
                    if(results.length > 0) {
                        callback(results[0])
                    }else{
                        callback(false)
                        return
                    }
                });
            });
        }else{
            callback(false)
        }
}