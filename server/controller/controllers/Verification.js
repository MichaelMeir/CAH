const response = require('../../response');
const errors = require('../../errors');

module.exports = {

    Verify: (req, res) => {
        let verification = req.params.verification
        req.db.sync(function(err) {
            if(err) {
                response(res, req.body, {}, 500, "Error while synchronizing database.", [errors.New("", errors.code.NotValid, err)])
                return
            }
            req.models.user.find({verification: verification},(err, result) => {
                if(err) {
                    response(res, req.body, {}, 500, "Error while finding user with verification code.", [errors.New("", errors.code.NotValid, err)])
                    return
                }
                if(result.length == 0) {
                    response(res, req.body, {}, 400, "No users found with given verification code.", [])
                    return
                }else{
                    let user = result[0]
                    user.verification = null;
                    user.save();
                    response(res, req.body, {}, 200, "Email has been verified", [])
                    return
                }
            })
        })
    }
}