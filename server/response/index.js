/**
 * 
 */
module.exports = (res, data = {}, status = 200, message = "No errors have occurred", errors = []) => {
    res.status(status).json({
        message: message,
        failure: !status.toString().startsWith("2"),
        errors: errors,
        payload: data
    })
}