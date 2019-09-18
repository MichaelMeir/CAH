require('dotenv').config();
const express = require('express');
const cors = require('cors')
const helmet = require('helmet')
const bodyparser = require('body-parser');

const orm = require('orm');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

const Controller = require('./controller')

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
               verification: String,
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
app.post('/api/auth/register', Controller("Auth@Register"))

app.listen(process.env.DEV? "9000" : "80")