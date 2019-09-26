require('dotenv').config();
const express = require('express');
const cors = require('cors')
const helmet = require('helmet')
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser')
const fs = require('fs')

const orm = require('orm');

const Controller = require('./controller')
const app = express();

const socketServer = require('./socket')

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(helmet());
app.use(bodyparser());
app.use(cookieParser(fs.readFileSync('private.key').toString()));

app.use(orm.express(`mysql://${process.env.MYSQL_USERNAME}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DATABASE}`, {
    define: function (db, models, next) {
        models.user = db.define("users", {
            uuid: String,
            username: String,
            username_withcase: String,
            password: String,
            email: String,
            verification: String,
            reset_token: String,
            session_id: String,
            session_ip: String,
        })
        next();
    }
}))

// app.use(socketServer);

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
app.post('/api/auth/register', Controller("Auth@register"))

/**
 * @callback /api/auth/login
 * @description Authenticates an existing user
 * 
 * @param {String} email Email that the user wants to authenticate and verify with
 * @param {String} password The password the user wishes to use to authenticate
 * 
 * @yields {Object} JSON response made by the response method
 */
app.post('/api/auth/login', Controller("Auth@login"))

/**
 * @callback /api/auth/check
 * @description Checks if an user is authenticated
 * 
 * @param {String} jwt The token that gets set when the user authenticates
 * 
 * @yields {Object} JSON response made by the response method
 */
app.post('/api/auth/check', Controller("Auth@checkUser"))

/**
 * @callback /api/auth/logout
 * @description Logs an authenticated user out
 * 
 * @param {String} jwt The token that gets set when the user authenticates
 * 
 * @yields {Object} JSON response made by the response method
 */
app.post('/api/auth/logout', Controller("Auth@logout"))

/**
 * @callback /api/auth/me
 * @description Fetches data about logged in user
 * 
 * @param {String} jwt The token that gets set when the user authenticates
 * 
 * @yields {Object} JSON response made by the response method
 */
app.post('/api/auth/me', Controller("Auth@me"))

/**
    * @callback /api/auth/profile
    * @description The route to save modifications made to the profile of the authenticated user
    * 
    * @param {String} jwt The token that gets set when the user authenticates
    * 
    * @yields {Object} JSON response made by the response method
    */
app.post('/api/auth/profile', Controller("Auth@saveChanges"))

/**
* @callback /api/auth/deleteAccount
* @description The route to delete an account
* 
* @param {String} jwt The token that gets set when the user authenticates
* 
* @yields {Object} JSON response made by the response method
*/
app.post('/api/auth/deleteAccount', Controller("Auth@deleteAccount"))

/**
 * @callback /api/verification/{uuid}
 * @description Verifies email, this link should only be available from email
 *
 * @param {String} uuid used to get the unverified user, if found it removes the uuid so that the user's email is verified
 *
 * @yields {Object} JSON response made by the response method
 */
app.post('/api/verification/:verification([a-z0-9-]+)', Controller("Verification@Verify"))

/**
 * @callback /api/reset/{token}
 * @description Changes password, this link should only be available from email
 *
 * @param {String} token used to get the token from user, if found it removes the token so that the user's password link disables.
 *
 * @yields {Object} JSON response made by the response method
 */
app.post('/api/reset/:token([a-z0-9-]+)', Controller("PasswordReset@Reset"))

/**
 * @callback /api/auth/resendMailMail
 * @description Resend verification mail
 * 
 * @param {String} jwt The token that gets set when the user authenticates
 * 
 * @yields {Object} JSON response made by the response method
 */
app.post('/api/auth/resendMail', Controller("Verification@resendMail"))

/**
 * @callback /api/reset
 * @description Reset the password of the user
 * 
 * @param {String} jwt The token that gets set when the user authenticates
 * 
 * @yields {Object} JSON response made by the response method
 */
app.post('/api/reset', Controller("PasswordReset@saveChanges"))

/**
 * @callback /api/sendResetLink
 * @description Sends the verification link to the user to reset his password
 * 
 * @param {String} jwt The token that gets set when the user authenticates
 * 
 * @yields {Object} JSON response made by the response method
 */
app.post('/api/sendResetLink', Controller("PasswordReset@sendResetLink"))

console.log("Server listening on 9000")

app.listen(9000)