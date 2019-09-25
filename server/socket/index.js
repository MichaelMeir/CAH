const WebSocket = require('ws');

const server = new Server(module.exports.port)

module.exports = {
    port: process.env.SOCKET_PORT,
    start: () =>  {
        if(!server) {
            server = new Server(process.env.SOCKET_PORT)
        }
        return module.exports
    }
}

function Server(port = 8127) {
    this.socket = new WebSocket.Server({port})
    this.handler = require('./handler.js')
    this.socket.on('connection', (client) => {
        client.on('message', (msg) => {
            try{
                let payload = JSON.parse(msg)
                if(payload.type && payload.content) {
                    if(this.handler[payload.type]) {
                        client.send(JSON.stringify(this.handler[payload.type]({
                            //still needs db, and models for database usage
                            meta: {},
                            socket: client
                        }, payload.content)))
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