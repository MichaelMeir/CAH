/*

data:
{
    username: "test"
    password: "test2"
}

template:
{
    username: "string min:3 nonnumerical word"
    password: "string min:3"
}

*/

const RULES = {
    "string": (value, args) => {
        return typeof value == "string"
    },

    "min": (value, args) => {
        return value.length >= Number(args[0])
    },

    "max": (value, args) => {
        return value.length <= Number(args[0])
    },

    "mail": (value, args) => {
        return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm.exec(value)
    },

    "word": (value, args) => {
        return /^[\w][^_]*$/gm.exec(value)
    }
}


/**
 * @description Validates data with given template, template requires keys with values as rules
 * @param {Object} data
 * @param {Object} template
 * @return {Boolean} Returns true if data validates with the given template
 */
module.exports = (data, template) => {
    let keys = Object.keys(template)
    //loop through template keys
    for(let i = 0; i < keys.length; i++) {
        //get key
        let key = keys[i]
        //get value of request
        let value = data[key]
        //check if value exists in request
        if(value) {
            //get rule list from template
            let ruleList = template[key]
            //split rule list to individual rules
            let rules = ruleList.split(" ")
            //loop through all rules
            for(let j = 0; j < rules.length; j++) {
                //split arguments in rule
                let args = rules[j].split(":")
                //get the rule function of the rule
                let ruleFunc = RULES[args.shift()]
                //check if rule function exists
                if(ruleFunc) {
                    //get result of rule function using the request value
                    let result = ruleFunc(value, args)
                    //return false if rule function failed
                    if(!result) return false
                }
            }
        }else{
            //return false if value did not exist in request
            return false
        }
    }
    return true
}