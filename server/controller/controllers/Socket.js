const response = require('../../response')

module.exports = {
    port: (req, res) => {
        response(res, req.body, {port: process.env.SOCKET_PORT}, 200, "Requested socket given with no errors", [])
    }
}