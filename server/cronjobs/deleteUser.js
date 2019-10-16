
const day = 1000*60*60*24
const time = process.env.VERIFICATION_TIME * day

module.exports = (meta) => {
    meta.db.sync((err) => {
        if(err) console.error(err)
        meta.models.user.find({verification: null}, (err, results) => {
            if(err) console.error(err)
            if(results > 0) {
                for(let i = 0; i < results.length; i++) {
                    let user = results[i]
                    if(user.created < (Date.now() - time)) {
                        user.remove()
                    }
                }
            }
        })
    })
}