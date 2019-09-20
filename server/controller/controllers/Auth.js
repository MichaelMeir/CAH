const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

const validator = require('../../validator');
const response = require('../../response');
const errors = require('../../errors')
const mailService = new (require('../../services/mailservice'))();

const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = {
     register: (req, res) => {
          let [success, err] = validator(req.body, {
               "username": "string min:3 max:16 word",
               "email": "string email",
               "password": "string min:5",
               "password_confirmation": "string min:5"
          })
          if (success) {
               req.db.sync(function (err) {
                    if (err) {
                         response(res, req.body, {}, 500, "Unexpected error while synchronizing database.", [err])
                         return
                    }
                    req.models.user.find({ or: [{ username: req.body.username.toLowerCase() }, { email: req.body.email.toLowerCase() }] }, (err, results) => {
                         if (err) {
                              response(res, req.body, {}, 500, "Unexpected error while requesting users from database.", [err])
                              return
                         }
                         if (results.length == 0) {
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

                              // mailService.send(result.email, "info@cardsagainst.me", "Test", "Test", "Test");

                              response(res, req.body, {}, 200, "User created succesfully", err);
                         } else {
                              var err = []
                              for (let i = 0; i < results.length; i++) {
                                   let user = results[i]
                                   if (user.email == req.body.email.toLowerCase()) {
                                        err.push(errors.New("email", errors.code.Exists, "someone else has already used this email address."))
                                   }
                                   if (user.username == req.body.username.toLowerCase()) {
                                        err.push(errors.New("username", errors.code.Exists, "someone else has already used this username."))
                                   }
                              }
                              response(res, req.body, {}, 409, "User could not be created due to conflicts between existing users.", err)
                              return
                         }
                    })
               })
          } else {
               response(res, req.body, {}, 400, "Request did not validate to required parameters and its rules", err)
          }
     },

     login: (req, res) => {
          let [success, err] = validator(req.body, {
               "email": "string",
               "password": "string"
          })
          if (success) {
               req.db.sync(function (err) {
                    if (err) {
                         response(res, req.body, {}, 500, "Unexpected error while synchronizing database.", [err])
                         return
                    }

                    req.models.user.find({ email: req.body.email.toLowerCase() }, (err, results) => {
                         if (err) {
                              response(res, req.body, {}, 500, "Unexpected error while requesting users from database.", [err])
                              return
                         }

                         var err = []

                         if (results.length === 1) {
                              const user = results[0]
                              const checkPassword = bcrypt.compareSync(req.body.password, user.password);

                              if (checkPassword) {
                                   // Success
                                   let privateKey = fs.readFileSync('key.pem', 'utf8').toString();
                                   // let cert = fs.readFileSync('server.crt', 'utf8');
                                   let sessionId = uuidv4();

                                   user.session_id = sessionId;
                                   user.session_ip = req.connection.remoteAddress;
                                   user.save();

                                   let token = jwt.sign({
                                        uuid: sessionId
                                   }, privateKey, { algorithm: 'RS256' });

                                   res.cookie("jwt", token, { signed: true })

                                   response(res, req.body, token, 200, "Authentication succesful", err);
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
          } else {
               response(res, req.body, {}, 400, "Request did not validate to required parameters and its rules", err)
          }
     },

     checkUser: (req, res) => {
          let privateKey = fs.readFileSync('server.cert', 'utf8').toString();

          if (req.signedCookies.jwt === null) {
               response(res, req.body, req.signedCookies, 403, "The user is not authenticated", [])
               return
          }

          jwt.verify(req.signedCookies.jwt, privateKey, { algorithms: ['RS256'] }, (err, decoded) => {
               if (err) {
                    response(res, req.body, req.signedCookies, 500, "Unexpected error while trying to decode JWT token.", [err])
                    return
               }

               const uuid = decoded.uuid;
               const ip = req.connection.remoteAddress;

               req.db.sync(function (err) {
                    if (err) {
                         response(res, req.body, {}, 500, "Unexpected error while synchronizing database.", [err])
                         return
                    }
                    req.models.user.find({ session_id: uuid, session_ip: ip }, (err, results) => {
                         if (err) {
                              response(res, req.body, {}, 500, "Unexpected error while requesting the user from database.", [err])
                              return
                         }

                         (results.length > 0) ? response(res, req.body, true, 200, "The user is authenticated.", err) : response(res, req.body, false, 403, "The user is not authenticated.", err);
                         return
                    });
               });
          });
     },

     logout: (req, res) => { 
          let privateKey = fs.readFileSync('server.cert', 'utf8').toString();

          jwt.verify(req.signedCookies.jwt, privateKey, { algorithms: ['RS256'] }, (err, decoded) => {
               if (err) {
                    response(res, req.body, req.signedCookies, 500, "Unexpected error while trying to decode JWT token.", [err])
                    return
               }

               const uuid = decoded.uuid;
               const ip = req.connection.remoteAddress;

               req.db.sync(function (err) {
                    if (err) {
                         response(res, req.body, {}, 500, "Unexpected error while synchronizing database.", [err])
                         return
                    }
                    req.models.user.find({ session_id: uuid, session_ip: ip }, (err, results) => {
                         if (err) {
                              response(res, req.body, {}, 500, "Unexpected error while requesting the user from database.", [err])
                              return
                         }

                         if (results.length > 0) {
                              // Logout
                              const user = results[0]

                              user.session_id = null;
                              user.session_ip = null;

                              user.save();

                              res.cookie("jwt", null, { signed: true, maxAge: 0 })
                         }
                    });
               });
          });
     }
}