const websocket = require('ws');
const validator = require('../validator');
const User = require('../user');

let server = null;

module.exports = {
    port: process.env.SOCKET_PORT,
    start: () =>  {
        if(!server) {
            server = new Server(process.env.SOCKET_PORT)
        }
        return module.exports
    },
    setHandler: (handler) => {
        server.setHandler(handler)
        return (req, res, next) => {
            server.setModels(req.models)
            server.setDb(req.db)
            next()
        }
    }
}

function Server(port = 8127) {
    console.log("starting websocket on " + port.toString())
    this.server = new websocket.Server({port: port})
    this.server.on('connection', ws => {
        let client = new Client(ws, (msg) => {
            try{
                let data = JSON.parse(msg)
                let [success] = validator(data, {
                    jwt: "string jwt",
                })
                if(success) {
                    User(data.jwt, (result, err) => {
                        if (err) {
                            return false
                        }
                        if (result) {
                            return true
                        } else {
                            return false
                        }
                    }, this.db, this.models)
                }else{
                    return false
                }
            }catch(e) {
                return false
            }
        }, this.handler)
    })

    this.setHandler = (handle) => {
        this.handler = handle
    }

    this.setModels = (models) => {
        this.models = models
    }

    this.setDb = (db) => {
        this.db = db
    }
}

function Client(ws, authentication, handler) {
    this.authenticated = false
    ws.on('message', (message) => {
        if(!this.authenticated) {
            if(authentication(message)) {
                this.authenticated = true
                ws.send(JSON.stringify({
                    type: "auth",
                    content: true
                }))
            }else{
                ws.send(JSON.stringify({
                    type: "auth",
                    content: false
                }))
            }
        }else{
            const response = handler(message)
            ws.send(response)
        }
    })
    ws.on('close', () => {
        return
    })
    ws.on('error', e => {
        console.log(e)
        return
    })
}