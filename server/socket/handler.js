
const User = require('../user');

let rooms = {}

module.exports = {
    import: [
        "ping",
        "leaveRoom",
        "sendMessage"
    ],
    
    /**
     * @method ping
     * @description Socket method to check if user is still connected to websocket using a timeout
     * 
     * @param {Object} meta contains util data
     */
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

    /**
     * @method joinRoom
     * @description joins user socket to room if accesible and not full
     * 
     * @param {Object} meta contains util data
     * @param {String} jwt jwt token to authenticate user to check if client is eligable to join a room
     * @param {String} roomId String containing a room id, checked in 'rooms' if exists
     * 
     * @yields {Object} with 'room' containing roomId, if null then joining a room failed
     */
    joinRoom(meta, jwt, roomId) {
        return User(jwt, (user, err) => {
            if(err || !user) {
                return {room: null, err: err, authenticated: false}
            }
            roomId = roomId.toLowerCase()
            if(user && rooms[roomId]) {
                if(rooms[roomId].users.length < rooms[roomId].maxPlayers) {
                    meta.room = roomId
                    rooms[roomId].currentPlayers += 1
                    rooms[roomId].users.push(user.uuid)
                    rooms[roomId].usernames.push(user.username_withcase)
                    rooms[roomId].previewPlayers = `${rooms[roomId].usernames[0]}, ${rooms[roomId].usernames[1]} ${rooms[roomId].usernames[2] ? ',' + rooms[roomId].usernames[2] : ''} and ${rooms[roomId].usernames[2] ? rooms[roomId].users.length - 3 : rooms[roomId].users.length - 2 } more...`,
                    meta.emit((emitMeta) => {
                        emitMeta.methods.sendMessage(user.username_withcase + " joined the game room!") // chat when user joins room
                    })
                    return {room: roomId}
                }else{
                    return {room: null, message: "Room is full"}
                }
            }
            return {room: null, message: "Room does not exist (anymore)"}
        }, meta.db, meta.models, meta.ip)
    },

    /**
     * @method leaveRoom
     * @description leaves user socket from room, notifies other users that the user has left
     * 
     * @param {Object} meta contains util data
     * @param {String} jwt jwt token to authenticate user to check if client is eligable to join a room 
     * 
     * @yields {Object} containing 'room' with null regardless of data sent
     */
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
                    rooms[meta.room] = undefined
                    delete rooms[meta.room]
                    return {rooms: null, deleted: true}
                }
                meta.emit((emitMeta) => {
                    emitMeta.methods.sendMessage(user.username_withcase + " Left the game room!") // chat when user leaves room
                })
                rooms[meta.room].users.filter(i => i !== user.uuid)
                rooms[meta.room].usernames.filter(i => i !== user.username_withcase)
            }
            return {room: null, deleted: false}
        }, meta.db, meta.models, meta.ip)
    },

    /**
     * @method createRoom
     * @description creates a room with owner as user requesting the new room
     * 
     * @param {Object} meta contains util data
     * @param {String} jwt jwt token to authenticate user to check if client is eligable to join a room
     * 
     * @yields {Object} with 'room' containing roomId, if null then joining a room failed
     */
    createRoom(meta, jwt) {
        return User(jwt, (user, err) => {
            if(err || !user) {
                if(err) console.error(err)
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
                        name: "Room " + code,
                        currentPlayers: 1,
                        maxPlayers: 10,
                        spectators: 0,
                        currentRound: 0,
                        maxRounds: 10,
                        type: 'public',
                        previewPlayers: `${user.username_withcase} and 0 more...`,
                        users: [user.uuid],
                        usernames: [user.username_withcase],
                    }
                    meta.room = code
                    return {room: code}
                }
            }
            return {room: null}
        }, meta.db, meta.models, meta.ip)
    },

    /**
     * @method getUsers
     * @description gives usernames of a specific room when requested
     * 
     * @param {Object} meta contains util data
     * @param {String} roomId String containing a room id, checked in 'rooms' if exists
     */
    getUsers(meta, roomId) {
        if(rooms[roomId]) {
            return rooms[roomId].usernames
        }
        return []
    },

    sendMessage(meta, jwt, message) {
        User(jwt, function(error, user){
            if(err || !user) {
                return false;
            }
            if(meta.room != null) {
                meta.emit(function(emitMeta){
                    meta.methods.sendMessage(user.username_withcase + message)
                }, {
                    room: meta.room
                })
                return true
            }
            return false;
        }, meta.db, meta.models, meta.ip)
    },

    checkRoom(meta, roomId) {
        return {room: (rooms[roomId] ? roomId : null)}
    },

    getRooms(meta) {
        let out = []
        for(let i = 0; i < Object.keys(rooms).length; i++) {
            const code = Object.keys(rooms)[i]
            var room = rooms[code]
            room.id = code
            out.push(room)
        }
        return out
    }
}
