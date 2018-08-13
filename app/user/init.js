const passport = require('passport')
const database = require( '../database' )

function initUser (app) {
  app.get('/', ( req, res) => {
    if ( req.isAuthenticated() ) {
      renderMainAuthorized( req, res )
    } else {
      renderMainUnAuthorized( req, res )
    }
  } )
  app.get('/profile',  passport.authenticationMiddleware(), renderProfile)
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

  database.findGroup( usr.id ).then( function( group ) {
    timetable = formString( group )
    console.log( group.dotw_0 + group.dotw_3 )
    res.render( 'profile', {
      layout: false,
      name: nameString,
      timetable: timetable
    })
  })
  
}

function formString( group ) {
  var res = ''
  if ( group.dotw_0 != null ) {
    res+= group.dotw_0 + '\n'
  }
  if ( group.dotw_1 != null ) {
    res+= group.dotw_1 + '\n'
  }
  if ( group.dotw_2 != null ) {
    res+= group.dotw_2 + '\n'
  }
  if ( group.dotw_3 != null ) {
    res+= group.dotw_3 + '\n'
  }
  if ( group.dotw_4 != null ) {
    res+= group.dotw_4 + '\n'
  }
  if ( group.dotw_5 != null ) {
    res+= group.dotw_5 + '\n'
  }
  if ( group.dotw_6 != null ) {
    res+= group.dotw_6 + '\n'
  }
  return res
}
module.exports = initUser
