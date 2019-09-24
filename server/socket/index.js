const websocket = require('ws');

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
        server.SetHandler(handler)
    }
}

function Server(port = 8127) {
    console.log("starting websocket on " + port.toString())
    this.server = new websocket.Server({port: port})
    this.connections = []
    this.server.on('connection', ws => {
        
        this.connections.push(ws)
        let response = ""
        ws.on('message', (message) => {
            response = this.handler(message)
            ws.send(response)
        })
        ws.on('close', () => {

        })
        ws.on('error', e => {
            console.log(e)
        })
    })

    this.SetHandler = (handle) => {
        this.handler = handle
    }
}