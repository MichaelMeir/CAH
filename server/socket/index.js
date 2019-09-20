const websocket = require('ws');

let server = null;

module.export = {
    port: process.env.SOCKET_PORT,
    start: () =>  {
        if(!server) {
            server = new Server(process.env.SOCKET_PORT)
        }
    }
}

function Server(port = 8127) {
    this.server = new websocket.Server({port: port})
    this.server.on('connection', ws => {
        let response = ""
        ws.on('message', (message) => {
            console.log(message)
            response = this.handler(message)
        })
        ws.send(response)
    })

    this.SetHandler = (handle) => {
        this.handler = handle
    }
}