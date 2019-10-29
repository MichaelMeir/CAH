
let db = null
let models = null

const fs = require('fs')
const folder = './cronjobs/'

module.exports = {
    express: (req, res, next) => {
        db = req.db
        models = req.models
        next()
    },
}

let jobs = []
fs.readdirSync(folder).forEach(file => {
    if(file.endsWith(".js") && !file.endsWith('index.js')) {
        jobs.push(require("./"+file))
    }
})

const minute = 1000*60
const time = minute*process.env.CRONJOB_TIME

let JobRepeater = () => {
    for(let i = 0; i < jobs.length; i++) {
        if(!db && !models) return
        jobs[i]({
            db, models
        })
    }
    setTimeout(JobRepeater, time)
}

setTimeout(JobRepeater, time)