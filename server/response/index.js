/**
 * @method response
 * @description Used to keep the responses of the backend all the same to not cause any unexpected responses.
 * 
 * @param {ExpressResponse} res Express Response to send back a response
 * @param {Object} parameters Parameters given in the request
 * @param {Object} data Data to be returned after processing the request
 * @param {Number} status HTTP Status Code
 * @param {String} message Message to give more data
 * @param {Array} errors Array with more info about given errors
 * 
 * @yields {Object} Responds a JSON object to the request client
 */
module.exports = (res, parameters = {}, data = {}, status = 200, message = "No errors have occurred", errors = []) => {
    res.status(status).json({
        message: message,
        failure: !status.toString().startsWith("2"),
        errors: errors,
        parameters: parameters,
        payload: data
    })
}