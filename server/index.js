const express = require('express');
const orm = require('orm');

const app = express();

app.use(orm.express(`mysql://${process.env.MYSQL_USERNAME}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DATABASE}`), {
    define: function(db, models, next) {
        
    }
})

app.get('/', (req, res) => {
    res.send("Hello world!");
})

app.listen(process.env.DEV?"8080":"80")