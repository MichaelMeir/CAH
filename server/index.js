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

app.post('/api/auth/register', (req, res) => {
    /* 
    {
	    "username": "",
	    "email": "",
	    "password": "",
	    "password_conf": "",
	    "captcha": ""
    }
    */
   if(validator(req.body, {
       "username": "string min:3 max:16 word",
       "email": "string email",
       "password": "string min:5",
       "password_conf": "string min:5"
   })) {
        // register
   }else{
        response(res, req.body, {}, 400, "Request did not validate to required parameters and its rules")
   }
})

app.listen(process.env.DEV?"8080":"80")