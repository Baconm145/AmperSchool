const path = require('path')
const passport = require('passport')
const express = require('express')
const session = require('express-session')
var httpsRedirect = require('express-https-redirect');
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const favicon = require('express-favicon');
const RedisStore = require('connect-redis')(session)
const config = require('../config')
const app = express()
require('./auth').init(app)

app.use('*', httpsRedirect(true));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(session({
  cookie: {
    secure: false,
    httpOnly : true
  },
  secret: config.redisStore.secret,
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public/'));
app.use('/favicon.ico', express.static('public/images/favicon.ico'));


app.use(favicon(__dirname + '/public/images/favicon.ico'));

var user = require('./user')

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

user.init(app)
user.post(app)


module.exports = app