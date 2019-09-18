require('dotenv').config();
const express = require('express');
const cors = require('cors')
const helmet = require('helmet')
const bodyparser = require('body-parser');

const orm = require('orm');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

const validator = require('./validator');
const response = require('./response');
const errors = require('./errors')

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyparser());

app.use(orm.express(`mysql://${process.env.MYSQL_USERNAME}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DATABASE}`, {
    define: function(db, models, next) {
          models.person = db.define("person", {
               uuid: String,
               username: String,
               username_withcase: String,
               password: String,
               email: String,
               session_id: String,
               session_ip: String,
          })
          next();
    }
}))

/**
 * @callback /api/auth/register
 * @description Registers a new user with given data in body of request
 * 
 * @param {String} username Username that the client wishes to have
 * @param {String} email Email that the user wants to authenticate and verify with
 * @param {String} password The password the user wishes to use to authenticate
 * @param {String} password_confirmation Second password used to check if the password wasnt typed incorrectly
 * @param {String} captcha Captcha code used to verify the user isnt a bot
 * 
 * @yields {Object} JSON response made by the response method
 */
app.post('/api/auth/register', (req, res) => {
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
})

app.listen(process.env.DEV? "9000" : "80")