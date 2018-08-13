const passport = require( 'passport' )
const bcrypt = require( 'bcrypt' )
const database = require( '../database' )
const LocalStrategy = require( 'passport-local' ).Strategy
const authenticationMiddleware = require( './middleware' )

passport.serializeUser( function ( user, done ) {
  done( null, user.id )
})

passport.deserializeUser( function ( id, done ) {
  database.findById( id ).then( function( user ) {
      done( null, user )
  } )
} )

function initPassport () {
  passport.use(new LocalStrategy(
    { 
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true 
  },
  function( req, login, password, done ) {

    var isValidPassword = function( userpass, password ) {
      return bcrypt.compareSync(password, userpass);
    }

    database.findByName( login ).then( function( user ) {
      if ( user ) {

        database.findHash( user.id ).then( function( user_pass ) {

          if (!isValidPassword( user_pass.password, password ) ) {
            return done(null, false, {
              message: 'Incorrect password.'
            } );
          }
          
          console.log(  )
          console.log( 'successful auth for', user.username )
          return done( null, user );

          } )
        } else {

          return done( null, false, {
            message: 'User does not exist'
          } )

        }
    } )
  } )
)
  passport.authenticationMiddleware = authenticationMiddleware
}

module.exports = initPassport