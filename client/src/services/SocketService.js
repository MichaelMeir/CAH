export default {
  import: Import,
  export: Export,
  connect: Connect
}

function Import (imports = []) {
  let functions = {}
  for (let i = 0; i < imports.length; i++) {
    functions[imports[i]] = DefaultFunction(imports[i])
  }
  functions['ping'] = DefaultFunction('ping')
  return functions
}

function ping (socket) {
  socket.send(JSON.stringify({
    type: 'ping',
    content: []
  }))
  return {ping: 1}
}

function Export (e) {
  exportedMethods = {
    ping,
    ...e
  }
}

let exportedMethods = {ping}
let socket = null

const isSocketOpen = async (socket) => {
  const wait = (resolve) => {
    if (socket.readyState === WebSocket.OPEN) {
      resolve(true)
    } else if (socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
      resolve(false)
    } else {
      setTimeout(wait, 100, resolve)
    }
  }
  return new Promise((resolve) => {
    setTimeout(wait, 100, resolve)
  })
}

function DefaultFunction (name) {
  return async function () {
    const result = await isSocketOpen(socket)
    if (!result) {
      console.error('WebSocket closed too soon!')
      return
    }
    socket.send(JSON.stringify({
      type: name,
      content: sanitizeInput(arguments)
    }))

    return new Promise((resolve, reject) => {
      awaiting[name] = {resolve, reject}

      setTimeout(function () {
        if (awaiting[name]) {
          awaiting[name].reject('timed out. no response was given.')
          awaiting[name] = undefined
        }
      }, 1000 * 3)
    })
  }
}

function sanitizeInput (data) {
  let params = []
  for (let i = 0; i < data.length; i++) {
    params[i] = data[i.toString()]
  }
  return params
}

let awaiting = {}

function Connect (port) {
  let protocol = location.protocol === 'https:' ? 'wss' : 'ws'
  socket = new WebSocket(`${protocol}://${location.hostname}:${port}`)
  socket.onmessage = (response) => {
    try {
      let output = JSON.parse(response.data)

      if (output.type && output.content) {
        if (awaiting[output.type]) {
          awaiting[output.type].resolve(output.content)
          awaiting[output.type] = undefined
        } else if (output.type.startsWith(':')) {
          let methodName = output.type.replace(':', '', 1)
          if (exportedMethods[methodName]) {
            let result = exportedMethods[methodName](socket, ...output.content)
            if (result) {
              socket.send(JSON.stringify({
                type: output.type,
                content: sanitizeInput(result)
              }))
            }
          }
        }
      } else if (output.type) {
        awaiting[output.type].reject('No content field given!')
        awaiting[output.type] = undefined
      }
    } catch (e) {
      console.log(e.toString())
    }
  }

  return new Promise((resolve, reject) => {
    socket.onopen = () => {
      resolve()
    }

    socket.onerror = (err) => {
      reject(err)
    }
  })
}
