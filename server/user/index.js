const jwt = require('jsonwebtoken')
const fs = require('fs')

const publicKey = fs.readFileSync('server.cert', 'utf8').toString()

module.exports = (req, callback) => {
    if(req.signedCookies.jwt) {
        let decoded = jwt.verify(req.signedCookies.jwt, publicKey, { algorithms: ['RS256'] })
        if(decoded) {
            let uuid = decoded.uuid;
            let ip = req.connection.remoteAddress;
            req.db.sync(function (err) {
                if (err) {
                     callback(false, err)
                     return
                }
                req.models.user.find({ session_id: uuid, session_ip: ip }, (err, results) => {
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
    }else{
        callback(false)
    }
}