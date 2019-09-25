const response = require('../../response');
const errors = require('../../errors');

module.exports = {

    Reset: (req, res) => {
        let token = req.params.token
        req.db.sync(function(err) {
            if(err) {
                response(res, req.body, {}, 500, "Error while synchronizing database.", [errors.New("", errors.code.NotValid, err)])
                return
            }
            req.models.user.find({reset_token: token},(err, result) => {
                if(err) {
                    response(res, req.body, {}, 500, "Error while finding user with reset code.", [errors.New("", errors.code.NotValid, err)])
                    return
                }
                if(result.length == 0) {
                    response(res, req.body, {}, 400, "No users found with given reset code.", [])
                    return
                }else{
                    let user = result[0]
                    user.reset_token = null;
                    user.save();
                    response(res, req.body, {}, 200, 'Token null', [])
                    return
                }
            })
        })
    },
}