require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');

const orm = require('orm');

const validator = require('./validator');
const response = require('./response')

const app = express();

app.use(bodyparser());

// app.use(orm.express(`mysql://${process.env.MYSQL_USERNAME}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DATABASE}`), {
//     define: function(db, models, next) {

//     }
// })

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
     let [success, errors] = validator(req.body, {
          "username": "string min:3 max:16 word",
          "email": "string email",
          "password": "string min:5",
          "password_confirmation": "string min:5"
      })
     if(success) {
          // register
     }else{
          response(res, req.body, {}, 400, "Request did not validate to required parameters and its rules", errors)
     }
})

app.listen(process.env.DEV?"8080":"80")