const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

const validator = require('../../validator');
const response = require('../../response');
const errors = require('../../errors')
const mailService = new (require('../../services/mailservice'))();

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
                  req.models.user.find({or:[{username: req.body.username.toLowerCase()},{email: req.body.email.toLowerCase()}]}, (err, results) => {
                       if(err) {
                            response(res, req.body, {}, 500, "Unexpected error while requesting users from database.", [err])
                            return
                       }
                       if(results.length == 0) {
                            let user = req.models.user.create({
                                 uuid: uuidv4(),
                                 username: req.body.username.toLowerCase(),
                                 username_withcase: req.body.username,
                                 password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
                                 email: req.body.email.toLowerCase(),
                                 verification: uuidv4(),
                                 session_id: "",
                                 session_ip: "",
                            }, err => {
                              if (err) {
                                   response(res, req.body, {}, 500, "Unexpected error while requesting users from database.", [err])
                                   return
                              }
                            })

                            response(res, req.body, {}, 200, "User created succesfully", err);
                       }else{
                            var err = []
                            for(let i = 0; i < results.length; i++) {
                                 let user = results[i]
                                 if(user.email == req.body.email.toLowerCase()) {
                                      err.push(errors.New("email", errors.code.Exists, "Someone has already used this email address."))
                                 }
                                 if(user.username == req.body.username.toLowerCase()) {
                                      err.push(errors.New("username", errors.code.Exists, "Someone has already used this username."))
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
   },

   Login: (req, res) => {
          let [success, err] = validator(req.body, {
               "email": "string",
               "password": "string"
          })
          if(success) {
               req.db.sync(function(err) {
                    if(err) {
                         response(res, req.body, {}, 500, "Unexpected error while synchronizing database.", [err])
                         return
                    }

                    req.models.user.find({email: req.body.email.toLowerCase()}, (err, results) => {
                         if (err) {
                              response(res, req.body, {}, 500, "Unexpected error while requesting users from database.", [err])
                              return
                         }

                         var err = []

                         if (results.length === 1) {
                              // TODO: Check if password is correct
                              const result = results[0]
                              
                              const checkPassword = bcrypt.compareSync(req.body.password, result.password);
                             
                             if (checkPassword) {
                                   // Success
                                   mailService.send(
                                        result.email, 
                                        "info@cardsagainst.me",
                                        "Email Confirmation as HTML", 
                                        "plain",
                                        "<a href='localhost:8080/api/auth/" + result.verification + "'style='color: red;'>Click to verify</h1>"
                                   );
                                   response(res, req.body, {}, 200, "Authentication succesful", err);
                              } else {
                                   err.push(errors.New("email", errors.code.Exists, "You have entered the wrong credentials."))

                                   response(res, req.body, {}, 403, "User could not authenticate due to wrong credentials.", err);
                              }

                         } else {
                              err.push(errors.New("email", errors.code.Exists, "You have entered the wrong credentials."))

                              response(res, req.body, {}, 403, "User could not authenticate due to wrong credentials.", err);
                         }
                    });
               })
          }else{
               response(res, req.body, {}, 400, "Request did not validate to required parameters and its rules", err)
          }
     }
}