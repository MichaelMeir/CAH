const WebSocket = require('ws');

const server = new Server(module.exports.port)

module.exports = {
    port: process.env.SOCKET_PORT,
    start: () =>  {
        if(!server) {
            server = new Server(process.env.SOCKET_PORT)
        }
        return module.exports
    },
    express: (req, res, next) => {
        server.db = req.db
        server.models = req.models
        next()
    }
}

function Server(port = 8127) {
    this.socket = new WebSocket.Server({port})
    this.handler = require('./handler.js')
    this.clients = []
    this.firstEmpty = () => {
        for(let i = 0; i < this.clients.length; i++) {
            if(!this.clients[i]) {
                return i
            }
        }
        return this.clients.length
    }
    this.socket.on('connection', (client, req) => {
        let index = this.firstEmpty()
        this.clients[index] = client
        let meta = {
            ip: req.connection.remoteAddress,
            db: this.db,
            models: this.models,
            socket: client,
            disconnect: () => {
                client.send(JSON.stringify({type: 'disconnected', content: {}}))
                client.close()
                console.log("disconnected user")
                this.clients[index] = undefined
            },
            methods: {},
        }

        let awaiting = {}
        this.DefaultFunction = function(name) {
            return async function() {
                client.send(JSON.stringify({
                    type: ":" + name,
                    content: sanitizeInput(arguments)
                }))
                return new Promise((resolve, reject) => {
                    awaiting[":"+name] = {resolve, reject}
                    setTimeout(function () {
                        if (awaiting[name]) {
                          awaiting[name].reject('timed out. no response was given.')
                          awaiting[name] = undefined
                          meta.disconnect()
                        }
                      }, 1000 * 3)
                })
            }
        }
        meta.methods = {}
        for(let i = 0; i < this.handler.import.length; i++) {
            meta.methods[this.handler.import[i]] = this.DefaultFunction(this.handler.import[i])
        }

        client.send(JSON.stringify({
            type: ':ping',
            content: []
        }))

        client.on('message', (msg) => {
            try{
                let payload = JSON.parse(msg)
                if(payload.type && payload.content) {
                    if(payload.type.startsWith(':')) {
                        if(awaiting[payload.type]) {
                            awaiting[payload.type].resolve(payload)
                        }
                    }else if(this.handler[payload.type]) {
                        let response = this.handler[payload.type](meta, ...payload.content)

                        let output = {}
                        if(response && response instanceof Array) {
                            let [out, updatedMeta] = response
                            output = out
                            if(updatedMeta) {
                                meta = updatedMeta
                            }
                        }else if(response) {
                            output = response
                        }
                        client.send(JSON.stringify({
                            type: payload.type,
                            content: output
                        }))
                    }
                }else{
                    throw "Payload did not contain type and content"
                    
                }
            }catch(e) {
                client.send(JSON.stringify({
                    type: "error",
                    content: e.toString()
                }))
            }
        })
    })
}

function sanitizeInput (data) {
    let params = []
    for (let i = 0; i < data.length; i++) {
      params[i] = data[i.toString()]
    }
    return params
}