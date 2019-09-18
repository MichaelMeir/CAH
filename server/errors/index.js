module.exports.code = {
    NotFilledIn: {
        id: 1,
        msg: "value was not filled in."
    },
    NotValid: {
        id: 2,
        msg: "value was not valid."
    },
    Exists: {
        id: 3,
        msg: "value has already been used."
    },
}

module.exports.New = (field, code, message = false) => {
    return {
        field: field,
        code: code.id,
        message: !message?code.msg:message
    }
}