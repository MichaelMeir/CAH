
const User = require('../user');

let rooms = {}

module.exports = {
    import: [
        "ping",
        "leaveRoom",
        "sendMessage"
    ],
    
    ping: (meta) => {
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
                if(meta.user && meta.room) {
                    if(rooms[meta.room].owner == meta.user) {
                        meta.emit((emitMeta) => {
                            emitMeta.methods.leaveRoom("Room owner disconnected.")
                        }, {room: emitMeta.room})
                        delete rooms[meta.room]
                    }
                }
                meta.disconnect()
            }, TIMEOUT)
        }, TIMEOUT)
        return [1]
    },

    joinRoom(meta, jwt, id) {
        return User(jwt, () => {
            if(err || !user) {
                return {room: null, err: err, authenticated: false}
            }
            id = id.toLowerCase()
            if(user && rooms[id]) {
                if(rooms[id].users.length < rooms[id].maxUsers) {
                    meta.room = id
                    rooms[id].users.push(user.uuid)
                    meta.emit((emitMeta) => {
                        emitMeta.methods.sendMessage(user.username_withcase + " joined the game room!") // chat when user joins room
                    })
                    return {room: id}
                }
            }
            return {room: null}
        }, meta.db, meta.models, meta.ip)
    },

    leaveRoom(meta, jwt) {
        return User(jwt, (user, err) => {
            if(err || !user) {
                return {room: null, err: err, authenticated: false}
            }
            if(user && meta.room && rooms[meta.room]) {
                if(rooms[meta.room].owner == user.uuid) {
                    meta.emit((emitMeta) => {
                        emitMeta.methods.leaveRoom("Room owner disconnected.")
                    })
                    delete rooms[meta.room]
                    return {rooms: null}
                }
                meta.emit((emitMeta) => {
                    emitMeta.methods.sendMessage(user.username_withcase + " Left the game room!") // chat when user leaves room
                })
                rooms[meta.room].users.filter(i => i !== user.uuid)
            }
            return {room: null}
        }, meta.db, meta.models, meta.ip)
    },

    createRoom(meta, jwt) {
        return User(jwt, () => {
            if(err || !user) {
                return {room: null, err: err, authenticated: false}
            }
            //create room with random code
            const TRIES = 3
            const CODE_LENGTH = 5
            const USE = "abcdefghijklmnopqrstuvwxyz1234567890"
            for(let i = 0; i < TRIES; i++) {
                let code = ""
                for(let j = 0; j < CODE_LENGTH; j++) {
                    code += USE[Math.floor(Math.random() * USE.length)]
                }
                if(rooms[code]) {
                    continue
                }else{
                    rooms[code] = {
                        owner: user.uuid,
                        users: [user.uuid],
                        maxUsers: 10,
                    }
                    return {room: code}
                }
            }
            return {room: null}
        }, meta.db, meta.models, meta.ip)
    }
}