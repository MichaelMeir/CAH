const jwt = require('jsonwebtoken')
const fs = require('fs')

const publicKey = fs.readFileSync('server.cert', 'utf8').toString()

module.exports = (req, callback, db = null, models = null, ip = null) => {
    if(req.signedCookies.jwt) {
        return validate(req.connection.remoteAddress, req.db, req.models, req.signedCookies.jwt, callback)
    }else{
        if(req instanceof String) {
            if(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/gm.exec(req)) {
                return validate(ip, db, models, req, callback)
            }else{
                return callback(false)
            }
        }else{
            return callback(false)
        }
    }
}

function validate(ip, db, models, token, callback) {
    let decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
        if(decoded) {
            let uuid = decoded.uuid;
            db.sync(function (err) {
                if (err) {
                     return callback(false, err)
                }
                models.user.find({ session_id: uuid, session_ip: ip }, (err, results) => {
                    if (err) {
                        return callback(false, err)
                    }
                    if(results.length > 0) {
                        return callback(results[0])
                    }else{
                        return callback(false)
                    }
                });
            });
        }else{
            return callback(false)
        }
}