var express = require('express');
var session = require('express-session');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.get('/', function (req, res) {

    if (!req.session.views) {
        req.session.views = 0
    }
    req.session.views = (req.session.views || 0) + 1;

    res.send('you viewed this page ' + req.session.views + ' times')
});

app.listen(4000);