const passport = require('passport')
const database = require( '../database' )
const bodyParser = require( 'body-parser' )
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const jsonParser = bodyParser.json()

function initPost( app ) {

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.post('/sendMark', jsonParser, function(req, res) {

        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        var lesson_id = req.body.lesson_id
        var student_id = req.body.student_id
        var mark = req.body.mark
        var info = req.body.info
        
        database.insertMark( lesson_id, student_id, mark, info ).then( function( respond ) {
            res.json( respond )
        })
    })

    app.post('/sendLesson', jsonParser, function(req, res) {

        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }
        
        database.insertLesson( req.body.group_id, req.body.date ).then( function( respond ) {
            res.json( respond )
        })
    })

    app.post('/showMark', jsonParser, function(req, res) {

        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        usr = req.user
        
        database.findLessonByDate( formDate( req.body.date ) ).then( function( lesson ) {
            if ( lesson == undefined ) { 
                res.json( 'Нет информации' )
            } else {
                database.findMarks( usr.id, lesson.id ).then( function( marks ) {
                    var absent = false
                    if ( lesson.absents !=  null ) {
                        if ( lesson.absents.includes( usr.id ) ) {
                            absent = true
                        }
                    }
                    res.json( [marks, absent] )
                })
            }            
        })
    })

    app.post('/sendHomework', jsonParser, function(req, res) {
        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        group_id = req.body.group_id
        homework = req.body.homework

        database.updateHomework( group_id, homework ).then( function( result ) {
            res.json( result )
        })
    })

    app.post('/sendGroup', jsonParser, function( req, res ) {
        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        name = req.body.group_name
        timetable = req.body.group_timetable

        database.findGroupByName( name ).then( function( result ) {
            if ( result.length != 0 ) {
                res.json( 'Такая группа уже существует!' )
            } else {
                database.insertGroup( name, timetable ).then( function() {
                    res.json( 'Успешно!' )
                })
            }
        })
    })

    app.post('/editGroup', jsonParser, function( req, res ) {
        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        id = req.body.group_id
        timetable = req.body.group_timetable

        database.updateGroup( id, timetable ).then( function() {
            res.json( 'Успешно!' )
        })
    })

    app.post('/sendUser', jsonParser, function( req, res ) {
        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        var firstname = req.body.firstname
        var lastname = req.body.lastname
        var email = req.body.email
        var city = req.body.city
        var rights = req.body.rights
        var username = req.body.username
        var group_id = req.body.group_id
        var password = req.body.password

        database.findByName( username ).then( function( result ) {
            if ( result != null ) {
                res.json( 'Пользователь с таким логином уже существует!' )
            } else {
                database.insertUser( firstname, lastname, email, city, rights, username, group_id ).then( function() {
                    var saltRounds = 10
                    var salt = bcrypt.genSaltSync(saltRounds)
                    var passwordHash = bcrypt.hashSync(password, salt)
                    database.findByName( username ).then( function( new_user ) {
                        database.insertHash( new_user.id, passwordHash ).then( function() {
                            res.json( 'Успешно!' )
                            var sendString = 'Добро пожаловать в AmperSchool! \n\n Ваши данные для входа:\nЛогин: ' + username + '\nПароль: ' + password
                            var text={ "hello.txt": sendString };
                            res.send( text[0] )
                        })
                    })
                })
            }
        })
    })

    app.post('/sendAbsent', jsonParser, function(req, res) {

        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        lesson_id = req.body.lesson_id
        student_id = req.body.student_id
        absent = req.body.absent

        database.findLesson( lesson_id ).then( function( lesson ) {
            absents = lesson.absents
            if ( absent == 'false' ) {
                if ( absents == null ) {
                    absents = []
                    absents.push( parseInt(student_id) )
                } else {
                    if ( absents.includes( parseInt(student_id) ) ) {
                        res.json( 'success' )
                    } else {
                        absents.push( parseInt(student_id) )
                    }
                }
            }
            database.updateAbsents( lesson_id, absents ).then( function( result ) {
                res.json( 'success' )
            })
        })
    })   

    app.post('/getAbsent', jsonParser, function(req, res) {

        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        lesson_id = req.body.lesson_id

        database.findLesson( lesson_id ).then( function( lesson ) {
            res.json( lesson )
        })
    })   

    app.post('/changeMark', jsonParser, function(req, res) {

        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        var mark = req.body.mark
        var mark_id = req.body.mark_id

        if ( mark == 'null' ) {
            database.deleteMark( mark_id ).then( function( respond ) {
                res.json( respond )
            })
        } else {
            database.changeMark( mark_id, mark ).then( function( respond ) {
                res.json( respond )
            })
        }
        
    })

    app.post('/getMarksInfo', jsonParser, function(req, res) {

        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }
        
        var lesson_id = req.body.lesson_id
        var student_id = req.body.student_id

        database.findMarks( student_id, lesson_id )
        .then( function( result ) {
            res.json( result )
        })
        .catch( function( err ) {
            res.json( err )
        })
        
    })

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

    app.post('/getLessons', jsonParser, function( req, res ) {

        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        var lessons = []

        var usr = req.user

        database.findLessons( req.body.group_id ).then( function(lessons) {
            res.json( lessons )
        })
    })

    app.post('/getStudents', jsonParser, function( req, res ) {

        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        var students = []

        var usr = req.user

        database.findStudents( req.body.group_id ).then( function(students) {
            res.json( students )
        })
    })


}

function formDate( date ) {
    var now = new Date( )
    var d = ''
    var day = parseInt( date.substring( 0, 2 ) )
    var month = parseInt( date.substring( 3, 5 ) )
    var year = now.getFullYear()
    if ( now.getMonth() < 8 ) {
        if ( month > 8 ) {
            year--
        }
    }
    d = year + '-' + month + '-' + day
    return d
  }

module.exports = initPost