const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

const validator = require('../../validator');
const response = require('../../response');
const errors = require('../../errors');
const User = require('../../user');
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
                              if (req.body.password !== req.body.password_confirmation) {
                                   let err = []

                                   err.push(errors.New("password", errors.code.Exists, "Please confirm your password"))
                                   response(res, req.body, {}, 409, "User could not be created due to password conflicts.", err)
                                   return

                              } else {
                                   req.models.user.create({
                                        uuid: uuidv4(),
                                        username: req.body.username.toLowerCase(),
                                        username_withcase: req.body.username,
                                        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
                                        email: req.body.email.toLowerCase(),
                                        verification: uuidv4(),
                                        reset_token: null,
                                        session_id: "",
                                        session_ip: "",
                                        liked_packs: JSON.stringify([]),
                                        created: Date.now()
                                   }, (err, result) => {
                                        if (err) {
                                             response(res, req.body, {}, 500, "Unexpected error while requesting users from database.", [err])
                                             return
                                        }

                                        if (result) {
                                             mailService.send(
                                                  result.email,
                                                  "info@cardsagainst.me",
                                                  "Email Confirmation as HTML",
                                                  "plain",
                                                  '<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css?family=Work+Sans&display=swap" rel="stylesheet"><link rel="stylesheet" type="text/css" href="style.css"><title></title></head><body><div id="mail"><img id="logo" src="' + process.env.CLIENT_URL + '/static/' + 'logo.png"> <div id="layout"> <h1 id="title">Verify This Email Address</h1> <div id="desc"> <p class="bottom">Hey ' + result.username + ',</p> <p class="bottom">Welcome to Cards Against Humanity!</p> <p class="bottom">Please click the button below to verify your email address.</p> <p class="bottom">If you did not sign up to CAH, please ignore this email or contact us at Email</p> <p class="bottom">CAH Support Team</p> </div> <div style="margin: 0 auto; text-align: center; display: flex; justify-content: center;"><a href="' + process.env.CLIENT_URL + '/verification/' + result.verification + '" style="margin: 10px 0px 20px 0px; list-style-type: none; display:block; background-color: #5c6ac4; padding: 10px 35px 10px 35px; color: white; border-radius: 5px;">Verify</a></div> <p id="extra">Or click this link: <a href="' + process.env.CLIENT_URL + '/verification/' + result.verification + '">' + process.env.CLIENT_URL + '/verification/' + result.verification + ' </a></p> </div> <div id="support"> <h2>Need Support?</h2> <p>Feel free to email us if you have any questions comments or suggestions. We"ll be happy to resolve your issues.</p> </div></div></body></html><style type="text/css">#logo {display: block;margin-right: auto;margin-left: auto;height: 160px;width: 240px;}.bottom {margin-bottom: 20px;}#bigtext {margin-bottom: 15px;font-weight: bold;font-size: 20px;}#extra {font-size: 12px;text-align: center;}#support {font-family: "Work Sans", sans-serif;border-radius: 5px;margin: 0px auto;width: 80%;margin-top: 150px;font-size: 15px;}#mail {background-color: #EEEEEE;height: 880px;margin: 0 auto;width: 700px;}#title {font-weight: bold;font-size: 25px;font-family: "Work Sans", sans-serif;margin-left: 40px;margin-top: 30px;}#layout {font-family: "Work Sans", sans-serif;border: solid #CDCDCD 1px;border-radius: 5px;background-color: white;margin: 0px auto;width: 80%;}#desc {margin-top: 20px;margin-left: 40px;margin-right: 20px; }#verifymail {background-color: #5c6ac4;color: white;font-weight: bold;margin-top: 20px;margin-bottom: 20px;width: 150px;height: 40px;border-radius: 5px;border: none;}#verifymail:hover {background-color: #202e78;color: white;margin-top: 20px;width: 150px;height: 40px;border-radius: 5px;}</style>'
                                             );

                                             response(res, req.body, {}, 200, "User created succesfully", err);
                                        }
                                   })
                              }
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
                         response(res, req.body, {}, 500, "Unexpected error while synchronizing database.", [errors.New("", errors.code.DatabaseError, err)])
                         return
                    }

                    req.models.user.find({ email: req.body.email.toLowerCase() }, (err, results) => {
                         if (err) {
                              response(res, req.body, {}, 500, "Unexpected error while requesting users from database.", [errors.New("", errors.code.DatabaseError, err)])
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
                                   err.push(errors.New("email", errors.code.NotValid, "You have entered the wrong credentials."))

                                   response(res, req.body, {}, 403, "User could not authenticate due to wrong credentials.", err);
                              }

                         } else {
                              err.push(errors.New("email", errors.code.NotValid, "You have entered the wrong credentials."))

                              response(res, req.body, {}, 403, "User could not authenticate due to wrong credentials.", err);
                         }
                    });
               })
          } else {
               response(res, req.body, {}, 400, "Request did not validate to required parameters and its rules", err)
          }
     },

     checkUser: (req, res) => {
          User(req, (result, err) => {
               if (err) {
                    response(res, req.body, {}, 500, "Error while checking if user is authenticated", [errors.New("", errors.code.DatabaseError, err)])
                    return
               }
               if (result) {
                    response(res, req.body, {}, 200, "User is authenticated", [])
               } else {
                    response(res, req.body, {}, 403, "User is not authenticated", [])
               }
          })
     },

     logout: (req, res) => {
          User(req, (user, err) => {
               if (err) {
                    response(res, req.body, {}, 500, "Error while checking if user is authenticated", [errors.New("", errors.code.DatabaseError, err)])
                    return
               }
               if (!user) {
                    response(res, req.body, {}, 403, "User is not authenticated", [])
                    return
               }

               user.session_id = null;
               user.session_ip = null;

               user.save();

               res.cookie("jwt", null, { signed: true, maxAge: 0 })
               response(res, req.body, {}, 200, "Logged out without errors", [])
          })
     },

     me: (req, res) => {
          User(req, (user, err) => {
               if (err) {
                    response(res, req.body, {}, 500, "Error while checking if user is authenticated", [errors.New("", errors.code.DatabaseError, err)])
                    return
               }
               if (!user) {
                    response(res, req.body, {}, 403, "User is not authenticated", [])
                    return
               }

               user.password = undefined
               user.session_id = undefined
               user.session_ip = undefined
               user.verification = (user.verification) ? true : false

               response(res, req.body, { user: user }, 200, "Requested user without errors", [])
          })
     },

     saveChanges: (req, res) => {
          User(req, (user, err) => {
               if (err) {
                    response(res, req.body, {}, 500, "Error while checking if user is authenticated", [errors.New("", errors.code.DatabaseError, err)])
                    return
               }
               if (!user) {
                    response(res, req.body, {}, 403, "User is not authenticated", [])
                    return
               }

               if (req.body.email !== user.email) {
                    // TODO: Email of user changed
                    user.email = req.body.email
                    user.verification = uuidv4()

                    mailService.send(
                         user.email,
                         "info@cardsagainst.me",
                         "Email Confirmation as HTML",
                         "plain",
                         '<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css?family=Work+Sans&display=swap" rel="stylesheet"><link rel="stylesheet" type="text/css" href="style.css"><title></title></head><body><div id="mail"><img id="logo" src="' + process.env.CLIENT_URL + '/static/' + 'logo.png"> <div id="layout"> <h1 id="title">Verify This Email Address</h1> <div id="desc"> <p class="bottom">Hey ' + user.username + ',</p> <p class="bottom">Welcome to Cards Against Humanity!</p> <p class="bottom">Please click the button below to verify your email address.</p> <p class="bottom">If you did not sign up to CAH, please ignore this email or contact us at Email</p> <p class="bottom">CAH Support Team</p> </div> <div style="display: flex; justify-content: center; width: 100%"> <a href="' + process.env.CLIENT_URL + '/verification/" ' + user.verification + '"><button style="width: 25%;" id="verifymail">Verify</button></a></div> <p id="extra">Or click this link: <a href="' + process.env.CLIENT_URL + '/verification/" ' + user.verification + '">' + process.env.CLIENT_URL + '/verification/' + user.verification + ' </a></p> </div> <div id="support"> <h2>Need Support?</h2> <p>Feel free to email us if you have any questions comments or suggestions. We"ll be happy to resolve your issues.</p> </div></div></body></html><style type="text/css">#logo {display: block;margin-right: auto;margin-left: auto;height: 160px;width: 240px;}.bottom {margin-bottom: 20px;}#bigtext {margin-bottom: 15px;font-weight: bold;font-size: 20px;}#extra {font-size: 12px;text-align: center;}#support {font-family: "Work Sans", sans-serif;border-radius: 5px;margin: 0px auto;width: 80%;margin-top: 150px;font-size: 15px;}#mail {background-color: #EEEEEE;height: 880px;margin: 0 auto;width: 700px;}#title {font-weight: bold;font-size: 25px;font-family: "Work Sans", sans-serif;margin-left: 40px;margin-top: 30px;}#layout {font-family: "Work Sans", sans-serif;border: solid #CDCDCD 1px;border-radius: 5px;background-color: white;margin: 0px auto;width: 80%;}#desc {margin-top: 20px;margin-left: 40px;margin-right: 20px; }#verifymail {background-color: #5c6ac4;color: white;font-weight: bold;margin-top: 20px;margin-bottom: 20px;width: 150px;height: 40px;border-radius: 5px;border: none;}#verifymail:hover {background-color: #202e78;color: white;margin-top: 20px;width: 150px;height: 40px;border-radius: 5px;}</style>'
                    );
               }

               if (req.body.new_password) {
                    let err = []
                    if (req.body.new_password !== req.body.new_password_confirmation) {
                         err.push(errors.New("new_password", errors.code.Exists, "Please confirm your new password"))
                         response(res, req.body, {}, 500, "Could not save changes", err);
                    } else {
                         const checkPassword = bcrypt.compareSync(req.body.current_password, user.password);

                         if (checkPassword) {
                              user.password = bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(10))
                         } else {
                              err.push(errors.New("current_password", errors.code.Exists, "Please enter a correct current password"))
                         }
                    }
               }

               user.save(err => {
                    if (err) { 
                         response(res, req.body, {}, 500, "An unexpected error occurred", err)
                         return
                    } else {
                         response(res, req.body, {}, 200, "Changes to the profile has been made", err)
                         return
                    }
               })
          })
     },

     deleteAccount: (req, res) => {
          User(req, (user, err) => {
               if (err) {
                    response(res, req.body, {}, 500, "Error while checking if user is authenticated", [errors.New("", errors.code.DatabaseError, err)])
                    return
               }
               if (!user) {
                    response(res, req.body, {}, 403, "User is not authenticated", [])
                    return
               }

               if (req.body.deleteCurrentPassword) {
                    const checkPassword = bcrypt.compareSync(req.body.deleteCurrentPassword, user.password);
                    let err = []

                    if (checkPassword) {
                         user.remove()
                         response(res, req.body, {}, 200, "Account deleted", err);
                    } else {
                         err.push(errors.New("deleteCurrentPassword", errors.code.Exists, "Please enter a correct current password"));
                         response(res, req.body, {}, 500, "Could not delete account", err);
                    }
               }
          })
     }
}