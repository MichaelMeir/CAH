// const websocket = require('ws');
// const validator = require('../validator');
// const User = require('../user');

// let server = null;

// module.exports = {
//     port: process.env.SOCKET_PORT,
//     start: () =>  {
//         if(!server) {
//             server = new Server(process.env.SOCKET_PORT)
//         }
//         return module.exports
//     },
//     setHandler: (handler) => {
//         server.setHandler(handler)
//         return (req, res, next) => {
//             server.setModels(req.models)
//             server.setDb(req.db)
//             next()
//         }
//     }
// }

// function Server(port = 8127) {
//     console.log("starting websocket on " + port.toString())
//     this.server = new websocket.Server({port: port})
//     this.server.on('connection', ws => {
//         let client = new Client(ws, (msg, ip) => {
//             try{
//                 let data = JSON.parse(msg)
//                 let [success] = validator(data, {
//                     jwt: "string jwt",
//                 })
//                 if(success) {
//                     User(data.jwt, (result, err) => {
//                         if (err) {
//                             return false
//                         }
//                         if (result) {
//                             return true
//                         } else {
//                             return false
//                         }
//                     }, this.db, this.models, ip)
//                 }else{
//                     return false
//                 }
//             }catch(e) {
//                 return false
//             }
//         }, this.handler)
//     })

//     this.setHandler = (handle) => {
//         this.handler = handle
//     }

//     this.setModels = (models) => {
//         this.models = models
//     }

//     this.setDb = (db) => {
//         this.db = db
//     }
// }

// function Client(ws, authentication, handler) {
//     this.authenticated = false
//     this.ip = ws._socket.remoteAddress
//     ws.on('message', (message) => {
//         if(!this.authenticated) {
//             if(authentication(message, this.ip)) {
//                 this.authenticated = true
//                 ws.send(JSON.stringify({
//                     type: "auth",
//                     content: true
//                 }))
//             }else{
//                 ws.send(JSON.stringify({
//                     type: "auth",
//                     content: false
//                 }))
//             }
//         }else{
//             const response = handler(message)
//             ws.send(response)
//         }
//     })
//     ws.on('close', () => {
//         return
//     })
//     ws.on('error', e => {
//         console.log(e)
//         return
//     })
// }

const WebSocket = require('ws');
const validator = require('../validator');
const User = require('../user');

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