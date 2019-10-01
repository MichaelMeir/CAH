
const User = require('../user');

let rooms = {}

module.exports = {
    import: [
        "ping",
    ],
    
    ping: (meta) => {
        const TIMEOUT = 1000 * 5
        if(meta.timeout) {
            clearTimeout(meta.timeout)
            meta.timeout = null
        }
        setTimeout(() => {
            try{
                meta.methods.ping()
            }catch(e) {
                console.log(e)
                meta.disconnect()
            }
            meta.timeout = setTimeout(() => {
                meta.disconnect()
            }, TIMEOUT)
        }, TIMEOUT)
        return [1]
    },

    retaart: (meta, a, b) => {
        return [a+b]
    }
}