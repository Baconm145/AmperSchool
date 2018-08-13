const path = require('path')
const passport = require('passport')
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const RedisStore = require('connect-redis')(session)
const config = require('../config')
const app = express()
require('./auth').init(app)

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

require('./user').init(app)

module.exports = app