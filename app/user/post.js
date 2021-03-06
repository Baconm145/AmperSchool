const passport = require('passport')
const database = require( '../database' )
const bodyParser = require( 'body-parser' )
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const uuidv1 = require('uuid/v1')
const jsonParser = bodyParser.json()
const yandexCheckout = require('./payment')
const xl = require('excel4node')
const path = require('path')
const fs = require('fs');

function initPost( app ) {


    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.post('/getPaymentInfo', jsonParser, function(req, res) {
        console.log(req)
    })

    app.post('/createPayment', jsonParser, function(req, res) {

        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        var amount = req.body.amount

        var idempotenceKey = uuidv1()

        createPayment( amount, idempotenceKey )
        .then(function(result) {
            res.redirect( result.confirmation.confirmation_url )
            console.log( result );
          })
        .catch(function(err) {
            console.error(err);
        })
        
    })

    function createPayment( amount, idempotenceKey ) {
        var promiseResult = new Promise( function( resolve, reject ) {
            yandexCheckout.createPayment({
                'amount': {
                  'value': amount,
                  'currency': 'RUB'
                },
                'confirmation': {
                  'type': 'redirect',
                  'return_url': 'https://www.amper.spb.ru'
                }
            }, idempotenceKey)
            .then( function( result ) {
                if ( result.status == "processing" ) {
                    this( amount, idempotenceKey )
                } else {
                    resolve( result )
                }
            })
            .catch( function(err) {
                reject( err )
            })
        })
        return promiseResult
    }

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

    app.post('/formExcelData', jsonParser, function( req, res ) {

        if(!req.body) return res.sendStatus(400)

        if ( !req.isAuthenticated() ) { res.redirect('/') }

        usr = req.user

        month_excel = parseInt( req.body.month_excel.value ) + 1
        month_group = req.body.group_id_excel.value

        database.findLessonsByMonthAndGroup( month_excel, month_group ).then( function( lessons_result ) {

            database.findUsersByGroupId( month_group ).then( function( group ) {
                var lessons = lessons_result.rows
                var wb = new xl.Workbook()
                var ws = wb.addWorksheet('Посещаемость')

                var cellStyle = wb.createStyle({
                    alignment: {
                      horizontal: 'right',
                    },
                  });

                ws.cell(1, 1).string('ФИО/Дата')

                ws.column(1).setWidth(30);

                group.sort(function( o1, o2 ) {
                    return o1.lastname.localeCompare(o2.lastname);
                })

                for ( var i = 0; i < group.length; i++ ) {
                    ws.cell(i + 2, 1).string( group[i].lastname + ' ' + group[i].firstname )
                }

                lessons.sort(function( o1, o2 ){
                    if ( o1.date < o2.date )    return -1;
                    else if( o1.date > o2.date ) return  1;
                    else                      return  0;
                  });


                for ( var i = 0; i < lessons.length; i++ ) {
                    ws.cell( 1, i + 2 ).date( lessons[i].date )
                }

                function findIndexByID( element, index, array ) {
                    if ( element.id == this ) {
                        return true
                    }
                }
                
                for ( var i = 0; i < lessons.length; i++ ) {
                    if ( lessons[i].absents == null ) {
                        lessons[i].absents = []
                    }
                    if ( lessons[i].absents_reasonable == null ) {
                        lessons[i].absents_reasonable = []
                    }
                    for ( var j = 0; j < lessons[i].absents.length; j++ ) {
                        var position = group.findIndex( findIndexByID, lessons[i].absents[j] ) + 2
                        ws.cell( position, i + 2 ).string('Н').style(cellStyle)
                    }
                    for ( var j = 0; j < lessons[i].absents_reasonable.length; j++ ) {
                        var position = group.findIndex( findIndexByID, lessons[i].absents_reasonable[j] ) + 2
                        ws.cell( position, i + 2 ).string('УП').style(cellStyle)
                    }
                }

                wb.write('report.xlsx', function(err, stats) {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log(stats); // Prints out an instance of a node.js fs.Stats object
                    }
                  })

                res.json( 'file generated' )
            })            
        })
    })

    app.get('/getExcelData', function( req, res ){

        if ( !req.isAuthenticated() ) { res.redirect('/') }

        res.type( 'document' )
        
        var pathStr = path.join( process.cwd(), 'report.xlsx' )

        var filename = req.query.group + ' ' + req.query.month + '.xlsx'

        res.download( pathStr, filename, function( err ) {
            fs.unlink( pathStr, (err) => {
                if (err) throw err;
            })
        })
    })

    app.post('/showMark', jsonParser, function(req, res) {

        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        usr = req.user
        
        database.findLessonByDate( formDate( req.body.date ), usr.group_id ).then( function( lesson ) {
            if ( lesson == undefined ) { 
                res.json( 'Нет информации' )
            } else {
                database.findMarks( usr.id, lesson.id ).then( function( marks ) {
                    var absent = 'false'
                    if ( lesson.absents !=  null ) {
                        if ( lesson.absents.includes( usr.id ) ) {
                            absent = 'true'
                        }
                    }
                    if  ( lesson.absents_reasonable != null ) {                        
                        if ( lesson.absents_reasonable.includes( usr.id ) ) {
                            absent = 'true_false'
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

        price = req.body.group_price
        name = req.body.group_name
        timetable = req.body.group_timetable

        database.findGroupByName( name ).then( function( result ) {
            if ( result.length != 0 ) {
                res.json( 'Такая группа уже существует!' )
            } else {
                database.insertGroup( name, timetable, price ).then( function() {
                    res.json( 'Успешно!' )
                })
            }
        })
    })

    app.post('/getGroup', jsonParser, function( req, res ) {
        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        id = req.body.group_id

        database.findGroup( id ).then( function( result ) {
            res.json( result )
        })
    })

    app.post('/editGroup', jsonParser, function( req, res ) {
        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        id = req.body.group_id
        timetable = req.body.group_timetable
        price = req.body.group_price

        database.updateGroup( id, timetable, price ).then( function() {
            res.json( 'Успешно!' )
        })
    })

    app.post('/editGroup', jsonParser, function( req, res ) {
        if(!req.body) return res.sendStatus(400)
    
        if ( !req.isAuthenticated() ) { res.redirect('/') }

        id = req.body.group_id
        timetable = req.body.group_timetable
        price = req.body.group_price

        database.updateGroup( id, timetable, price ).then( function() {
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
            absents_reasonable = lesson.absents_reasonable

            Array.prototype.remove = function() {
                var what, a = arguments, L = a.length, ax;
                while (L && this.length) {
                    what = a[--L];
                    while ((ax = this.indexOf(what)) !== -1) {
                        this.splice(ax, 1);
                    }
                }
                return this;
            };

            if ( absents == null ) {
                absents = []
            }

            if ( absents_reasonable == null ) {
                absents_reasonable = []
            }
            
            if ( absent == 'false' ) {
                absents.push( parseInt(student_id) )
                absents_reasonable.remove( parseInt(student_id) )
            }

            if ( absent == 'true' ) {
                absents.remove( parseInt(student_id) )
                absents_reasonable.remove( parseInt(student_id) )
            }

            if ( absent == 'false_true' ) {
                absents.remove( parseInt(student_id) )
                absents_reasonable.push( parseInt(student_id) )
            }

            database.updateAbsents( lesson_id, absents ).then( function( result ) {
                database.updateAbsentsReasonable( lesson_id, absents_reasonable ).then( function( reslut ) {
                    res.json( 'success' )
                })
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
            console.log( student_id )
            console.log( lesson_id )
            console.log(result)
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

        database.findGroup( usr.group_id ).then( function( group ) {    
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