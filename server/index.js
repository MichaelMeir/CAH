const express = require('express');
const bodyparser = require('body-parser');
const orm = require('orm');
const validator = require('./validator');

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
       "username": "string min:3"
   })) {
        res.send("Succesful!")
   }else{
        res.send("Request was not complete.")
   }
})

app.listen(process.env.DEV?"8080":"80")