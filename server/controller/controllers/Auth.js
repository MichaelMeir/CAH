const bcrypt = require("bcrypt");
const uuidv4 = require("uuid/v4");

const validator = require("../../validator");
const response = require("../../response");
const errors = require("../../errors");
const User = require("../../user");
const mailService = new (require("../../services/mailservice"))();

const jwt = require("jsonwebtoken");
const fs = require("fs");
const axios = require("axios");

module.exports = {
  register: async (req, res) => {
    let [success, err] = validator(req.body, {
      username: "string min:3 max:16 word",
      email: "string email",
      password: "string min:5",
      password_confirmation: "string min:5",
      captchaToken: "string"
    });
    if (success) {
      const { token } = req.body;

      try {
        let request = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_KEY}&response=${token}`
        );

        if (request.status === 200) {
          req.db.sync(function(err) {
            if (err) {
              response(
                res,
                req.body,
                {},
                500,
                "Unexpected error while synchronizing database.",
                [err]
              );
              return;
            }
            req.models.user.find(
              {
                or: [
                  { username: req.body.username.toLowerCase() },
                  { email: req.body.email.toLowerCase() }
                ]
              },
              (err, results) => {
                if (err) {
                  response(
                    res,
                    req.body,
                    {},
                    500,
                    "Unexpected error while requesting users from database.",
                    [err]
                  );
                  return;
                }
                if (results.length == 0) {
                  if (req.body.password !== req.body.password_confirmation) {
                    let err = [];

                    err.push(
                      errors.New(
                        "password",
                        errors.code.Exists,
                        "Please confirm your password"
                      )
                    );
                    response(
                      res,
                      req.body,
                      {},
                      409,
                      "User could not be created due to password conflicts.",
                      err
                    );
                    return;
                  } else {
                    req.models.user.create(
                      {
                        uuid: uuidv4(),
                        username: req.body.username.toLowerCase(),
                        username_withcase: req.body.username,
                        password: bcrypt.hashSync(
                          req.body.password,
                          bcrypt.genSaltSync(10)
                        ),
                        email: req.body.email.toLowerCase(),
                        verification: uuidv4(),
                        ver_expire_date: null,
                        reset_token: null,
                        session_id: "",
                        session_ip: "",
                        liked_packs: JSON.stringify([]),
                        expire_date: "",
                        created: Date.now(),
                        avatar:
                          "data:image/png;base64,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"
                      },
                      (err, result) => {
                        if (err) {
                          response(
                            res,
                            req.body,
                            {},
                            500,
                            "Unexpected error while requesting users from database.",
                            [err]
                          );
                          return;
                        }

                        if (result) {
                          mailService.send(
                            result.email,
                            "info@cardsagainst.me",
                            "Email Confirmation as HTML",
                            "plain",
                            '<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css?family=Work+Sans&display=swap" rel="stylesheet"><link rel="stylesheet" type="text/css" href="style.css"><title></title></head><body><div id="mail"><img id="logo" src="' +
                              process.env.CLIENT_URL +
                              "/static/" +
                              'logo.png"> <div id="layout"> <h1 id="title">Verify This Email Address</h1> <div id="desc"> <p class="bottom">Hey ' +
                              result.username +
                              ',</p> <p class="bottom">Welcome to Cards Against Humanity!</p> <p class="bottom">Please click the button below to verify your email address.</p> <p class="bottom">If you did not sign up to CAH, please ignore this email or contact us at Email</p> <p class="bottom">CAH Support Team</p> </div> <div style="margin: 0 auto; text-align: center; display: flex; justify-content: center;"><a href="' +
                              process.env.CLIENT_URL +
                              "/verification/" +
                              result.verification +
                              '" style="margin: 10px 0px 20px 0px; list-style-type: none; display:block; background-color: #5c6ac4; padding: 10px 35px 10px 35px; color: white; border-radius: 5px;">Verify</a></div> <p id="extra">Or click this link: <a href="' +
                              process.env.CLIENT_URL +
                              "/verification/" +
                              result.verification +
                              '">' +
                              process.env.CLIENT_URL +
                              "/verification/" +
                              result.verification +
                              ' </a></p> </div> <div id="support"> <h2>Need Support?</h2> <p>Feel free to email us if you have any questions comments or suggestions. We"ll be happy to resolve your issues.</p> </div></div></body></html><style type="text/css">#logo {display: block;margin-right: auto;margin-left: auto;height: 160px;width: 240px;}.bottom {margin-bottom: 20px;}#bigtext {margin-bottom: 15px;font-weight: bold;font-size: 20px;}#extra {font-size: 12px;text-align: center;}#support {font-family: "Work Sans", sans-serif;border-radius: 5px;margin: 0px auto;width: 80%;margin-top: 150px;font-size: 15px;}#mail {background-color: #EEEEEE;height: 880px;margin: 0 auto;width: 700px;}#title {font-weight: bold;font-size: 25px;font-family: "Work Sans", sans-serif;margin-left: 40px;margin-top: 30px;}#layout {font-family: "Work Sans", sans-serif;border: solid #CDCDCD 1px;border-radius: 5px;background-color: white;margin: 0px auto;width: 80%;}#desc {margin-top: 20px;margin-left: 40px;margin-right: 20px; }#verifymail {background-color: #5c6ac4;color: white;font-weight: bold;margin-top: 20px;margin-bottom: 20px;width: 150px;height: 40px;border-radius: 5px;border: none;}#verifymail:hover {background-color: #202e78;color: white;margin-top: 20px;width: 150px;height: 40px;border-radius: 5px;}</style>'
                          );

                          response(
                            res,
                            req.body,
                            {},
                            200,
                            "User created succesfully",
                            err
                          );
                        }
                      }
                    );
                  }
                } else {
                  var err = [];
                  for (let i = 0; i < results.length; i++) {
                    let user = results[i];
                    if (user.email == req.body.email.toLowerCase()) {
                      err.push(
                        errors.New(
                          "email",
                          errors.code.Exists,
                          "someone else has already used this email address."
                        )
                      );
                    }
                    if (user.username == req.body.username.toLowerCase()) {
                      err.push(
                        errors.New(
                          "username",
                          errors.code.Exists,
                          "someone else has already used this username."
                        )
                      );
                    }
                  }
                  response(
                    res,
                    req.body,
                    {},
                    409,
                    "User could not be created due to conflicts between existing users.",
                    err
                  );
                  return;
                }
              }
            );
          });
        }
      } catch (err) {
        response(res, req.body, {}, 500, "User captcha error", err);
        return;
      }
    } else {
      response(
        res,
        req.body,
        {},
        400,
        "Request did not validate to required parameters and its rules",
        err
      );
    }
  },

  login: (req, res) => {
    let [success, err] = validator(req.body, {
      email: "string",
      password: "string"
    });
    if (success) {
      req.db.sync(function(err) {
        if (err) {
          response(
            res,
            req.body,
            {},
            500,
            "Unexpected error while synchronizing database.",
            [errors.New("", errors.code.DatabaseError, err)]
          );
          return;
        }

        req.models.user.find(
          { email: req.body.email.toLowerCase() },
          (err, results) => {
            if (err) {
              response(
                res,
                req.body,
                {},
                500,
                "Unexpected error while requesting users from database.",
                [errors.New("", errors.code.DatabaseError, err)]
              );
              return;
            }

            var err = [];

            if (results.length === 1) {
              const user = results[0];
              const checkPassword = bcrypt.compareSync(
                req.body.password,
                user.password
              );

              if (checkPassword) {
                // Success
                let privateKey = fs.readFileSync("key.pem", "utf8").toString();
                // let cert = fs.readFileSync('server.crt', 'utf8');
                let sessionId = uuidv4();

                user.session_id = sessionId;
                user.session_ip = req.connection.remoteAddress;
                user.save();

                let token = jwt.sign(
                  {
                    uuid: sessionId
                  },
                  privateKey,
                  { algorithm: "RS256" }
                );

                res.cookie("jwt", token, { signed: true });

                response(
                  res,
                  req.body,
                  token,
                  200,
                  "Authentication succesful",
                  err
                );
              } else {
                err.push(
                  errors.New(
                    "email",
                    errors.code.NotValid,
                    "You have entered the wrong credentials."
                  )
                );

                response(
                  res,
                  req.body,
                  {},
                  403,
                  "User could not authenticate due to wrong credentials.",
                  err
                );
              }
            } else {
              err.push(
                errors.New(
                  "email",
                  errors.code.NotValid,
                  "You have entered the wrong credentials."
                )
              );

              response(
                res,
                req.body,
                {},
                403,
                "User could not authenticate due to wrong credentials.",
                err
              );
            }
          }
        );
      });
    } else {
      response(
        res,
        req.body,
        {},
        400,
        "Request did not validate to required parameters and its rules",
        err
      );
    }
  },

  checkUser: (req, res) => {
    User(req, (result, err) => {
      if (err) {
        response(
          res,
          req.body,
          {},
          500,
          "Error while checking if user is authenticated",
          [errors.New("", errors.code.DatabaseError, err)]
        );
        return;
      }
      if (result) {
        response(res, req.body, {}, 200, "User is authenticated", []);
      } else {
        response(res, req.body, {}, 403, "User is not authenticated", []);
      }
    });
  },

  logout: (req, res) => {
    User(req, (user, err) => {
      if (err) {
        response(
          res,
          req.body,
          {},
          500,
          "Error while checking if user is authenticated",
          [errors.New("", errors.code.DatabaseError, err)]
        );
        return;
      }
      if (!user) {
        response(res, req.body, {}, 403, "User is not authenticated", []);
        return;
      }

      user.session_id = null;
      user.session_ip = null;

      user.save();

      res.cookie("jwt", null, { signed: true, maxAge: 0 });
      response(res, req.body, {}, 200, "Logged out without errors", []);
    });
  },

  me: (req, res) => {
    User(req, (user, err) => {
      if (err) {
        response(
          res,
          req.body,
          {},
          500,
          "Error while checking if user is authenticated",
          [errors.New("", errors.code.DatabaseError, err)]
        );
        return;
      }
      if (!user) {
        response(res, req.body, {}, 403, "User is not authenticated", []);
        return;
      }

      user.password = undefined;
      user.session_id = undefined;
      user.session_ip = undefined;
      user.verification = user.verification ? true : false;

      response(
        res,
        req.body,
        { user: user },
        200,
        "Requested user without errors",
        []
      );
    });
  },

  saveChanges: (req, res) => {
    User(req, (user, err) => {
      if (err) {
        response(
          res,
          req.body,
          {},
          500,
          "Error while checking if user is authenticated",
          [errors.New("", errors.code.DatabaseError, err)]
        );
        return;
      }
      if (!user) {
        response(res, req.body, {}, 403, "User is not authenticated", []);
        return;
      }

      if (req.body.email !== user.email) {
        // TODO: Email of user changed
        user.email = req.body.email;
        user.verification = uuidv4();

        mailService.send(
          user.email,
          "info@cardsagainst.me",
          "Email Confirmation as HTML",
          "plain",
          '<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css?family=Work+Sans&display=swap" rel="stylesheet"><link rel="stylesheet" type="text/css" href="style.css"><title></title></head><body><div id="mail"><img id="logo" src="' +
            process.env.CLIENT_URL +
            "/static/" +
            'logo.png"> <div id="layout"> <h1 id="title">Verify This Email Address</h1> <div id="desc"> <p class="bottom">Hey ' +
            user.username +
            ',</p> <p class="bottom">Welcome to Cards Against Humanity!</p> <p class="bottom">Please click the button below to verify your email address.</p> <p class="bottom">If you did not sign up to CAH, please ignore this email or contact us at Email</p> <p class="bottom">CAH Support Team</p> </div> <div style="display: flex; justify-content: center; width: 100%"> <a href="' +
            process.env.CLIENT_URL +
            '/verification/" ' +
            user.verification +
            '"><button style="width: 25%;" id="verifymail">Verify</button></a></div> <p id="extra">Or click this link: <a href="' +
            process.env.CLIENT_URL +
            '/verification/" ' +
            user.verification +
            '">' +
            process.env.CLIENT_URL +
            "/verification/" +
            user.verification +
            ' </a></p> </div> <div id="support"> <h2>Need Support?</h2> <p>Feel free to email us if you have any questions comments or suggestions. We"ll be happy to resolve your issues.</p> </div></div></body></html><style type="text/css">#logo {display: block;margin-right: auto;margin-left: auto;height: 160px;width: 240px;}.bottom {margin-bottom: 20px;}#bigtext {margin-bottom: 15px;font-weight: bold;font-size: 20px;}#extra {font-size: 12px;text-align: center;}#support {font-family: "Work Sans", sans-serif;border-radius: 5px;margin: 0px auto;width: 80%;margin-top: 150px;font-size: 15px;}#mail {background-color: #EEEEEE;height: 880px;margin: 0 auto;width: 700px;}#title {font-weight: bold;font-size: 25px;font-family: "Work Sans", sans-serif;margin-left: 40px;margin-top: 30px;}#layout {font-family: "Work Sans", sans-serif;border: solid #CDCDCD 1px;border-radius: 5px;background-color: white;margin: 0px auto;width: 80%;}#desc {margin-top: 20px;margin-left: 40px;margin-right: 20px; }#verifymail {background-color: #5c6ac4;color: white;font-weight: bold;margin-top: 20px;margin-bottom: 20px;width: 150px;height: 40px;border-radius: 5px;border: none;}#verifymail:hover {background-color: #202e78;color: white;margin-top: 20px;width: 150px;height: 40px;border-radius: 5px;}</style>'
        );
      }

      if (req.body.new_password) {
        let err = [];
        if (req.body.new_password !== req.body.new_password_confirmation) {
          err.push(
            errors.New(
              "new_password",
              errors.code.Exists,
              "Please confirm your new password"
            )
          );
          response(res, req.body, {}, 500, "Could not save changes", err);
        } else {
          const checkPassword = bcrypt.compareSync(
            req.body.current_password,
            user.password
          );

          if (checkPassword) {
            user.password = bcrypt.hashSync(
              req.body.new_password,
              bcrypt.genSaltSync(10)
            );
          } else {
            err.push(
              errors.New(
                "current_password",
                errors.code.Exists,
                "Please enter a correct current password"
              )
            );
          }
        }
      }

      user.save(err => {
        if (err) {
          response(res, req.body, {}, 500, "An unexpected error occurred", err);
          return;
        } else {
          response(
            res,
            req.body,
            {},
            200,
            "Changes to the profile has been made",
            err
          );
          return;
        }
      });
    });
  },

  saveAvatar: (req, res) => {
    User(req, (user, err) => {
      if (err) {
        response(
          res,
          req.body,
          {},
          500,
          "Error while checking if user is authenticated",
          [errors.New("", errors.code.DatabaseError, err)]
        );
        return;
      }
      if (!user) {
        response(res, req.body, {}, 403, "User is not authenticated", []);
        return;
      }

      if (req.body.avatar !== undefined || req.body.avatar !== null) {
        user.avatar = req.body.avatar;
        user.save(err => {
          if (err) {
            response(
              res,
              req.body,
              {},
              500,
              "An unexpected error occurred",
              err
            );
            return;
          } else {
            response(res, req.body, {}, 200, "Avatar saved", []);
            return;
          }
        });
      }
    });
  },

  deleteAccount: (req, res) => {
    User(req, (user, err) => {
      if (err) {
        response(
          res,
          req.body,
          {},
          500,
          "Error while checking if user is authenticated",
          [errors.New("", errors.code.DatabaseError, err)]
        );
        return;
      }
      if (!user) {
        response(res, req.body, {}, 403, "User is not authenticated", []);
        return;
      }

      if (req.body.deleteCurrentPassword) {
        const checkPassword = bcrypt.compareSync(
          req.body.deleteCurrentPassword,
          user.password
        );
        let err = [];

        if (checkPassword) {
          user.remove();
          response(res, req.body, {}, 200, "Account deleted", err);
        } else {
          err.push(
            errors.New(
              "deleteCurrentPassword",
              errors.code.Exists,
              "Please enter a correct current password"
            )
          );
          response(res, req.body, {}, 500, "Could not delete account", err);
        }
      }
    });
  }
};
