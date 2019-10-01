module.exports = {
    import: [
        "ping"
    ],
    ping: async (meta) => {
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
        return {ping: 1}
    },

    authenticate: async (meta, a, b, c) => {
        return {test: a + b}
    }
}