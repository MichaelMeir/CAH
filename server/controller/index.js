const folder = "./controller/controllers/"
const fs = require('fs')

var controllers = {}

fs.readdirSync(folder).forEach(file => {
    if(file.endsWith(".js")) {
        let name = file.split('.').slice(0, -1).join('.')
        controllers[name] = require("./controllers/"+file)
    }
})

module.exports = (controller) => {
    let controllerFile = controller.split("@")
    return controllers[controllerFile[0]][controllerFile[1]]
}