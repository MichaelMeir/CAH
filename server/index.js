require('dotenv').config();
const express = require('express');
const cors = require('cors')
const helmet = require('helmet')
const bodyparser = require('body-parser');

const orm = require('orm');

const validator = require('./validator');
const response = require('./response')

const app = express();

app.use(cors());
app.use(helmet());
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
          db.sync(function(err) {
          if (err) {
                         response(res,req.body,{}, 500, "database error occured.", [err])
                         return
                    } 

          Person.find({ surname: "Doe" }, function (err, people) { //[{}, {}]
               if (err) {
                         response(res,req.body,{}, 500, "database error occured.", [err])
                         return
                    }
               people.foreach() => {
                    if(people.name != this.username) {
                         response(res,req.body,{}, 500, "database error occured.", [err])
                         return
                    }
               }

               {    
                    Person.create({ id: 1, name: "John", surname: "Doe", age: 27 }, function(err) {
                         if (err) {
                              response(res,req.body,{}, 500, "database error occured.", [err])
                         } else {
                              response(res,req.body, {}, 200, "user succesfully created.")
                         }
                    }
               } else{
                    response(res,req.body,{}, 500, "database error occured.", [err])
                    return
               }

          }
     }

     }else{
          response(res, req.body, {}, 400, "Request did not validate to required parameters and its rules", errors)
     }
})

app.listen(process.env.DEV? "9000" : "80")