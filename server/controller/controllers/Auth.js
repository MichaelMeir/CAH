module.exports = {
    Register: (req, res) => {
        let [success, err] = validator(req.body, {
             "username": "string min:3 max:16 word",
             "email": "string email",
             "password": "string min:5",
             "password_confirmation": "string min:5"
         })
        if(success) {
             req.db.sync(function(err) {
                  if(err) {
                       response(res, req.body, {}, 500, "Unexpected error while synchronizing database.", [err])
                       return
                  }
                  req.models.person.find({or:[{username: req.body.username.toLowerCase()},{email: req.body.email.toLowerCase()}]}, (err, results) => {
                       if(err) {
                            response(res, req.body, {}, 500, "Unexpected error while requesting users from database.", [err])
                            return
                       }
                       if(results.length == 0) {
                            req.models.person.create({
                                 uuid: uuidv4(),
                                 username: req.body.username.toLowerCase(),
                                 username_withcase: req.body.username,
                                 password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
                                 email: req.body.email.toLowerCase(),
                                 verification: uuidv4(),
                                 session_id: "",
                                 session_ip: "",
                            })
                       }else{
                            var err = []
                            for(let i = 0; i < results.length; i++) {
                                 let user = results[i]
                                 if(user.email == req.body.email.toLowerCase()) {
                                      err.push(errors.New("email", errors.code.Exists, "someone else has already used this email address."))
                                 }
                                 if(user.username == req.body.username.toLowerCase()) {
                                      err.push(errors.New("username", errors.code.Exists, "someone else has already used this username."))
                                 }
                            }
                            response(res, req.body, {}, 409, "User could not be created due to conflicts between existing users.", err)
                            return
                       }
                  })
             })
        }else{
             response(res, req.body, {}, 400, "Request did not validate to required parameters and its rules", err)
        }
   }
}