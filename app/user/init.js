const passport = require('passport')
const database = require( '../database' )
var bodyParser = require( 'body-parser' )
var nodemailer = require('nodemailer');

var jsonParser = bodyParser.json();

function initUser (app) {
  app.get('/', ( req, res) => {
    if ( req.isAuthenticated() ) {
      renderMainAuthorized( req, res )
    } else {
      renderMainUnAuthorized( req, res )
    }
  } )
  app.get('/profile',  passport.authenticationMiddleware(), renderProfile)

  app.post('/showMark', jsonParser, function(req, res) {

    if(!req.body) return res.sendStatus(400)

    if ( !req.isAuthenticated() ) { res.redirect('/') }

    var usr = req.user

    database.findLessonByDate( formDate( req.body.date ) ).then( function( lesson ) {
      database.findMarks( usr.id, lesson.id ).then( function( marks ) {
        var absent = false
        if ( lesson.absents !=  null ) {
          if ( lesson.absents.includes( usr.id ) ) {
            absent = true
          }
        }
        res.json( [marks, absent] )
      } )
    } )
  } )

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.post('/showDates', jsonParser, function(req, res) {

    if(!req.body) return res.sendStatus(400)

    if ( !req.isAuthenticated() ) { res.redirect('/') }
    
    var dates = []

    var usr = req.user
    database.findGroup( usr.id ).then( function( group ) {

      database.findLessons( group.id ).then( function( lessons ) {
        for ( var i = 0; i < lessons.length; i++ ) {
          if ( lessons[i].date.getMonth() == req.body.month ) {
            dates.push( lessons[i].date )
          }
        }
        res.json( dates )
      })
    })
  })

  app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {

      if (err) { return next(err) }

      if (!user) {   
        return( 
          res.render( 'home', {
            layout: false,
            unauthorized: true,
            fail: true
          })
        )
      }

      req.logIn(user, function(err) {
        if (err) { return next(err) }
        return res.redirect('/profile')
      })

    })(req, res, next);
  })
  app.post('/logout', function( req, res ) {
    req.logout()
    res.redirect('/')      
  } )

  app.post('/mail', function( req, res ) {

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'amperSchool@gmail.com',
        pass: 'dd499c3ce7'
      }
    })

    var string = ''
    string += 'Поступила новая заявка!\nФ.И.О: ' + req.body.name + '\nТелефон: ' + req.body.phone + '\nКласс ' + req.body.class

    var mailOptions = {
      from: 'amperSchool@gmail.com',
      to: 'amper.fiz@yandex.ru',
      subject: 'Новая заявка!',
      text: string
    }

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        res.render( 'home', {
          layout: false,
          unauthorized: true,
          success: true
        })
        console.log('Email sent: ' + info.response);
      }
    })

  })
}
  
function renderMainAuthorized( req, res ) {
  var usr = req.user
  var nameString = usr.firstname.charAt(0) + '. ' + usr.lastname;
  res.render( 'home', {
    layout: false,
    unauthorized: false,
    name: nameString
  } )
}

function renderMainUnAuthorized( req, res ) {
  res.render( 'home', {
    layout: false,
    unauthorized: true
  } )
}

function renderProfile( req, res ) {
  var usr = req.user
  var nameString = usr.firstname.charAt(0) + '. ' + usr.lastname;

  var timetable
  var months
  var dates

  database.findGroup( usr.id ).then( function( group ) {

    database.findLessons( group.id ).then( function( lessons ) {

      timetable = formTimetable( group )
      months = formMonths()

      res.render( 'profile', {
        layout: false,
        name: nameString,
        timetable: timetable,
        months: months
      })

    })
  })  
}

function formDate( date ) {
  var result = ''
  var month = date.substring( 3 )
  var day = date.substring( 0, 2 )
  var d = new Date()
  if ( month > 9 ) {
    result += d.getFullYear() - 1
  } else {
    result += d.getFullYear()
  }
  result += '-' + month + '-' + day
  return result
}

function formMonths(  ) {
  var result = ''
  var d = new Date()
  var currentMonth = d.getMonth()
  var monthsPassed = 0
  if ( currentMonth > 8 ) {
    monthsPassed = ( currentMonth - 9 )
  } else {
    monthsPassed = ( currentMonth + 4 )
  }
  var months = [ 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь','Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август' ]
  for ( var i = 0; i <= monthsPassed ; i++ ) {
    result += '<div id="profile_performance_month">' + months[ i ] + '</div>'
  }
  return result
}

function formTimetable( group ) {
  var res = ''
  if ( group.dotw_0 != null ) {
    res+= 'пн:  ' + group.dotw_0.substring(0, 5) + ' - ' + ( parseInt( group.dotw_0.substring(0, 2) ) + 2 ).toString() + ':00 '
  }
  if ( group.dotw_1 != null ) {
    res+= 'вт:  ' + group.dotw_1.substring(0, 5) + ' - ' + ( parseInt( group.dotw_0.substring(0, 2) ) + 2 ).toString() + ':00 '
  }
  if ( group.dotw_2 != null ) {
    res+= 'ср:  ' + group.dotw_2.substring(0, 5) + ' - ' + ( parseInt( group.dotw_0.substring(0, 2) ) + 2 ).toString() + ':00 '
  }
  if ( group.dotw_3 != null ) {
    res+= 'чт:  ' + group.dotw_3.substring(0, 5) + ' - ' + ( parseInt( group.dotw_0.substring(0, 2) ) + 2 ).toString() + ':00 '
  }
  if ( group.dotw_4 != null ) {
    res+= 'пт:  ' + group.dotw_4.substring(0, 5) + ' - ' + ( parseInt( group.dotw_0.substring(0, 2) ) + 2 ).toString() + ':00 '
  }
  if ( group.dotw_5 != null ) {
    res+= 'сб:  ' + group.dotw_5.substring(0, 5) + ' - ' + ( parseInt( group.dotw_0.substring(0, 2) ) + 2 ).toString() + ':00 '
  }
  if ( group.dotw_6 != null ) {
    res+= 'вс:  ' + group.dotw_6.substring(0, 5) + ' - ' + ( parseInt( group.dotw_0.substring(0, 2) ) + 2 ).toString() + ':00 '
  }
  return res
}
module.exports = initUser
