const response = require('../../response');
const errors = require('../../errors');
const bcrypt = require('bcrypt');
const mailService = new (require('../../services/mailservice'))();
const uuidv4 = require('uuid/v4');

module.exports = {
    Reset: (req, res) => {
        let token = req.params.token
        req.db.sync(function (err) {
            if (err) {
                response(res, req.body, {}, 500, "Error while synchronizing database.", [errors.New("", errors.code.NotValid, err)])
                return
            }
            req.models.user.find({ reset_token: token }, (err, result) => {
                if (err) {
                    response(res, req.body, {}, 500, "Error while finding user with reset code.", [errors.New("", errors.code.NotValid, err)])
                    return
                }
                if (result.length == 0) {
                    response(res, req.body, {}, 400, "No users found with given reset code.", [])
                    return
                } else {
                    response(res, req.body, {}, 200, "User found", [])
                    return
                }
            })
        })
    },

    sendResetLink: (req, res) => {
        req.db.sync(function (err) {
            if (err) {
                response(res, req.body, {}, 500, "Unexpected error while synchronizing database.", [errors.New("", errors.code.DatabaseError, err)])
                return
            }

            req.models.user.find({ email: req.body.email }, (err, results) => {
                if (results.length === 1) {
                    let user = results[0]

                    user.reset_token = uuidv4()
                    user.save()

                    mailService.send(
                        user.email,
                        "info@cardsagainst.me",
                        "Reset your password",
                        "plain",
                        '<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css?family=Work+Sans&display=swap" rel="stylesheet"><link rel="stylesheet" type="text/css" href="style.css"><title></title></head><body><div id="mail"><img id="logo" src="' + process.env.CLIENT_URL + '/static/' + 'logo.png"> <div id="layout"> <h1 id="title">Verify This Email Address</h1> <div id="desc"> <p class="bottom">Hey ' + user.username + ',</p> <p class="bottom">Welcome to Cards Against Humanity!</p> <p class="bottom">Please click the button below to reset your password.</p> <p class="bottom">If you did not request this reset, please ignore this email or contact us at Email</p> <p class="bottom">CAH Support Team</p> </div> <div style="display: flex; justify-content: center; width: 100%"> <button style="width: 25%;" id="verifymail">Reset</button> </div> <p id="extra">Or click this link: <a href="' + process.env.CLIENT_URL + '/reset/' + user.reset_token + '">' + process.env.CLIENT_URL + '/reset/' + user.reset_token + ' </a></p> </div> <div id="support"> <h2>Need Support?</h2> <p>Feel free to email us if you have any questions comments or suggestions. We"ll be happy to resolve your issues.</p> </div></div></body></html><style type="text/css">#logo {display: block;margin-right: auto;margin-left: auto;height: 160px;width: 240px;}.bottom {margin-bottom: 20px;}#bigtext {margin-bottom: 15px;font-weight: bold;font-size: 20px;}#extra {font-size: 12px;text-align: center;}#support {font-family: "Work Sans", sans-serif;border-radius: 5px;margin: 0px auto;width: 80%;margin-top: 150px;font-size: 15px;}#mail {background-color: #EEEEEE;height: 880px;margin: 0 auto;width: 700px;}#title {font-weight: bold;font-size: 25px;font-family: "Work Sans", sans-serif;margin-left: 40px;margin-top: 30px;}#layout {font-family: "Work Sans", sans-serif;border: solid #CDCDCD 1px;border-radius: 5px;background-color: white;margin: 0px auto;width: 80%;}#desc {margin-top: 20px;margin-left: 40px;margin-right: 20px; }#verifymail {background-color: #5c6ac4;color: white;font-weight: bold;margin-top: 20px;margin-bottom: 20px;width: 150px;height: 40px;border-radius: 5px;border: none;}#verifymail:hover {background-color: #202e78;color: white;margin-top: 20px;width: 150px;height: 40px;border-radius: 5px;}</style>'
                    );
                }
            })

            response(res, req.body, {}, 200, "Processed", [])
            return
        })

        // mailService.send(
        //         user.email, 
        //         "info@cardsagainst.me",
        //         "Email Confirmation as HTML", 
        //         "plain",
        //         '<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css?family=Work+Sans&display=swap" rel="stylesheet"><link rel="stylesheet" type="text/css" href="style.css"><title></title></head><body><div id="mail"><img id="logo" src="' + process.env.CLIENT_URL + '/static/' + 'logo.png"> <div id="layout"> <h1 id="title">Verify This Email Address</h1> <div id="desc"> <p class="bottom">Hey '+ user.username + ',</p> <p class="bottom">Welcome to Cards Against Humanity!</p> <p class="bottom">Please click the button below to verify your email address.</p> <p class="bottom">If you did not sign up to CAH, please ignore this email or contact us at Email</p> <p class="bottom">CAH Support Team</p> </div> <div style="display: flex; justify-content: center; width: 100%"> <button style="width: 25%;" id="verifymail">Verify</button> </div> <p id="extra">Or click this link: <a href="' + process.env.CLIENT_URL + '/verification/'+ user.verification +'">' + process.env.CLIENT_URL + '/verification/'+ user.verification +' </a></p> </div> <div id="support"> <h2>Need Support?</h2> <p>Feel free to email us if you have any questions comments or suggestions. We"ll be happy to resolve your issues.</p> </div></div></body></html><style type="text/css">#logo {display: block;margin-right: auto;margin-left: auto;height: 160px;width: 240px;}.bottom {margin-bottom: 20px;}#bigtext {margin-bottom: 15px;font-weight: bold;font-size: 20px;}#extra {font-size: 12px;text-align: center;}#support {font-family: "Work Sans", sans-serif;border-radius: 5px;margin: 0px auto;width: 80%;margin-top: 150px;font-size: 15px;}#mail {background-color: #EEEEEE;height: 880px;margin: 0 auto;width: 700px;}#title {font-weight: bold;font-size: 25px;font-family: "Work Sans", sans-serif;margin-left: 40px;margin-top: 30px;}#layout {font-family: "Work Sans", sans-serif;border: solid #CDCDCD 1px;border-radius: 5px;background-color: white;margin: 0px auto;width: 80%;}#desc {margin-top: 20px;margin-left: 40px;margin-right: 20px; }#verifymail {background-color: #5c6ac4;color: white;font-weight: bold;margin-top: 20px;margin-bottom: 20px;width: 150px;height: 40px;border-radius: 5px;border: none;}#verifymail:hover {background-color: #202e78;color: white;margin-top: 20px;width: 150px;height: 40px;border-radius: 5px;}</style>'
        //    );

        //    response(res, req.body, {}, 200, "Verification mail sent succesfully", err);
    },

    saveChanges: (req, res) => {
        req.db.sync(function (err) {
            if (err) {
                response(res, req.body, {}, 500, "Unexpected error while synchronizing database.", [errors.New("", errors.code.DatabaseError, err)])
                return
            }

            req.models.user.find({ reset_token: req.body.token }, (err, results) => {
                if (err) {
                    response(res, req.body, {}, 500, "Unexpected error while requesting users from database.", [errors.New("", errors.code.DatabaseError, err)])
                    return
                }

                if (results.length === 1) {
                    let user = results[0]

                    user.reset_token = null
                    user.password = bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(10))
                    user.save()

                    response(res, req.body, {}, 200, "Password changed", [])
                    return
                } else {
                    response(res, req.body, {}, 500, "User not found", [])
                    return
                }
            })
        })
    }
}