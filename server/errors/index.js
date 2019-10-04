
/**
 * @public
 * @description Error codes to be used in errors that are expected to be sent back to the requester
 */
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
    DatabaseError: {
        id: 4,
        msg: "Unexpected database error."
    }
}

/**
 * @method errors.New
 * @description This function returns an object error, this prevents the requester to end up with unexpected data.
 * 
 * @param {String} field The data field given, if this isnt applicable, use empty string
 * @param {Object} code Code is expected to be imported from errors.code.*, includes an id and a default message
 * @param {String} message this message can be altered to get a custom error message, otherwise it will get the default message from the code
 * 
 * @returns {Object} Error Object 
 */
module.exports.New = (field, code, message = false) => {
    return {
        field: field,
        code: code.id,
        message: !message?code.msg:message
    }
}