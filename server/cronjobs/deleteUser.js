
module.exports = (meta) => {
    meta.db.sync((err) => {
        if(err) console.error(err)
        meta.models.user.find({}, (err, results) => {
            if(err) console.error(err)
            
        })
    })
}