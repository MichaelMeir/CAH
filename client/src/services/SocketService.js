module.exports = {
  import: Import,
  connect: Connect
}

function Import (imports = []) {
  for (let i = 0; i < imports.length; i++) {
    module.exports[imports[i]] = DefaultFunction(imports[i])
  }
}

let socket = null

function DefaultFunction (name) {
  return async function () {
    socket.send(JSON.stringify({
      type: name,
      content: arguments
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

let awaiting = {}

function Connect (port) {
  let protocol = location.protocol === 'https' ? 'wss' : 'ws'
  socket = new WebSocket(`${protocol}//${location.hostname}:${port}`)
  socket.onmessage((response) => {
    try {
      let output = JSON.parse(response.data)
      if (output.type && output.content) {
        awaiting[output.type].resolve(output.content)
        awaiting[output.type] = undefined
      } else if (output.type) {
        awaiting[output.type].reject('No content field given!')
        awaiting[output.type] = undefined
      }
    } catch (e) {
      console.log(e.toString())
    }
  })
}
