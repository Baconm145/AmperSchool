const passport = require('passport')
const database = require( '../database' )
var bodyParser = require( 'body-parser' )
var nodemailer = require('nodemailer');

var jsonParser = bodyParser.json();

function initUser (app) {

  app.get('/ukhta', ( req, res) => {
    if ( req.isAuthenticated() ) {
      renderMainAuthorizedUkhta( req, res )
    } else {
      renderMainUnAuthorizedUkhta( req, res )
    }
  })

  app.get('/repetitor', ( req, res) => {
    if ( req.isAuthenticated() ) {
      renderMainAuthorizedRep( req, res )
    } else {
      renderMainUnAuthorizedRep( req, res )
    }
  })

  renderMainAuthorizedRep
  app.get('/', ( req, res) => {
    if ( req.isAuthenticated() ) {
      renderMainAuthorized( req, res )
    } else {
      renderMainUnAuthorized( req, res )
    }
  } )

  app.get('/profile',  passport.authenticationMiddleware(), renderProfile)

  app.use(bodyParser.urlencoded({
    extended: true
  }))

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
      var rights = [ 'student', 'admin', 'teacher' ]
      if ( rights.includes( user.rights ) ) {
        req.logIn(user, function(err) {
          if (err) { return next(err) }
          return res.redirect('/profile')
        })
      } else {
        return( 
          res.render( 'home', {
            layout: false,
            unauthorized: true,
            fail: true
          })
        )
      }
    })(req, res, next);
  })
  app.post('/logout', function( req, res ) {
    req.logout()
    res.redirect('/')      
  } )

  app.post('/mailSPb', function( req, res ) {

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
        console.log('Email sent: ' + info.response);
      }
    })
    
    res.render( 'mail', {
      layout: false,
      ukhta: false
    })
  })

  app.post('/mailUkhta', function( req, res ) {

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
        console.log('Email sent: ' + info.response);
      }
    })
    
    res.render( 'mail', {
      layout: false,
      ukhta: true
    })
  })  
}

function renderMainAuthorizedRep( req, res ) {
  var usr = req.user
  var nameString = usr.firstname.charAt(0) + '. ' + usr.lastname;
  res.render( 'home', {
    layout: false,
    unauthorized: false,
    ukhta: false,
    name: nameString,
    price_3: '2500',
    price_2: '5000',
    price_1: '6500',
    title: 'Школа физики в СПБ +7 (904) 108-16-25',
    offer: 'РЕПЕТИТОРЫ ПО ФИЗИКЕ В СПБ ОТ 375 РУБ./ЧАС',
    suboffer: 'Занятия по уникальной методике с гарантией результата - попробуйте бесплатно'
  } )
}

function renderMainUnAuthorizedRep( req, res ) {
  res.render( 'home', {
    layout: false,
    unauthorized: true,
    ukhta: false,
    price_3: '2500',
    price_2: '5000',
    price_1: '6500',
    title: 'Школа физики в Ухте +7 (904) 108-16-25',
    offer: 'РЕПЕТИТОРЫ ПО ФИЗИКЕ В СПБ ОТ 375 РУБ./ЧАС',
    suboffer: 'Занятия по уникальной методике с гарантией результата - попробуйте бесплатно'
  } )
}

function renderMainAuthorizedUkhta( req, res ) {
  var usr = req.user
  var nameString = usr.firstname.charAt(0) + '. ' + usr.lastname;
  res.render( 'home', {
    layout: false,
    unauthorized: false,
    ukhta: true,
    name: nameString,
    price_3: '2500',
    price_2: '5000',
    price_1: '6500',
    title: 'Школа физики в Ухте +7 (904) 108-16-25',
    offer: 'ПОДГОТОВИМ К ЕГЭ И ОГЭ ПО ФИЗИКЕ ЗА 7 МЕС. В УХТЕ',
    suboffer: 'Или вернем деньги! Занятия по уникальной методике от 312 руб. за час'
  } )
}

function renderMainUnAuthorizedUkhta( req, res ) {
  res.render( 'home', {
    layout: false,
    unauthorized: true,
    ukhta: true,
    price_3: '2500',
    price_2: '5000',
    price_1: '6500',
    title: 'Школа физики в Ухте +7 (904) 108-16-25',
    offer: 'ПОДГОТОВИМ К ЕГЭ И ОГЭ ПО ФИЗИКЕ ЗА 7 МЕС. В УХТЕ',
    suboffer: 'Или вернем деньги! Занятия по уникальной методике от 312 руб. за час'
  } )
}
  
function renderMainAuthorized( req, res ) {
  var usr = req.user
  var nameString = usr.firstname.charAt(0) + '. ' + usr.lastname;
  res.render( 'home', {
    layout: false,
    unauthorized: false,
    name: nameString,
    ukhta: false,
    price_3: '4000',
    price_2: '7000',
    price_1: '9000',
    title: 'Школа физики в СПб +7 (904) 108-16-25',
    offer: 'ПОДГОТОВИМ К ЕГЭ И ОГЭ ПО ФИЗИКЕ ЗА 7 МЕС. В СПБ',
    suboffer: 'Или вернем деньги! Занятия по уникальной методике от 375 руб. за час'
  } )
}

function renderMainUnAuthorized( req, res ) {
  res.render( 'home', {
    layout: false,
    unauthorized: true,
    ukhta: false,
    price_3: '4000',
    price_2: '7000',
    price_1: '9000',
    title: 'Школа физики в СПб +7 (904) 108-16-25',
    offer: 'ПОДГОТОВИМ К ЕГЭ И ОГЭ ПО ФИЗИКЕ ЗА 7 МЕС. В СПБ',
    suboffer: 'Или вернем деньги! Занятия по уникальной методике от 375 руб. за час'
  } )
}

function renderProfile( req, res ) {
  if ( req.user.rights == 'student' ) {
    renderStudentProfile( req, res )
  } 
  if ( req.user.rights == 'teacher' ) {
    renderTeacherProfile( req, res )
  }
  if ( req.user.rights == 'admin' ) {
    renderAdminProfile( req, res )
  }
}

function renderTeacherProfile( req, res ) {
  usr = req.user
  var nameString = usr.firstname.charAt(0) + '. ' + usr.lastname;
  var options
  database.findEveryGroup().then( function( groups ) {
    options = formOptions( groups )
    res.render( 'profileTeacher', {
      layout: false,
      name: nameString,
      options: options
    })
  })
}

function renderAdminProfile( req, res ) {
  usr = req.user
  var nameString = usr.firstname.charAt(0) + '. ' + usr.lastname;
  var options
  database.findEveryGroup().then( function( groups ) {
    options = formOptions( groups )
    res.render( 'profileAdmin', {
      layout: false,
      name: nameString,
      options: options
    })
  })
}

function formOptions( groups ) {
  var result = ''
  for ( var i = 0; i < groups.length; i++ ) {
    result += '<option value="' + groups[i].id + '">' + groups[i].name + '</option>'
  }
  return result
}

function renderStudentProfile( req, res ) {
  var usr = req.user
  var nameString = usr.firstname.charAt(0) + '. ' + usr.lastname;

  var timetable
  var months

  database.findGroup( usr.group_id ).then( function( group ) {

    database.findHomework( group.id ).then( function( hometask ) {
      
      database.findPayments( usr.id ).then( function( payments ) {

        homework = hometask.task
        var finances = "Р/счет № 40802810828000003990 <br>ИНН получателя: 110213678801 <br>БИК: 048702640 <br>КПП: 110202001 <br>Наименование организации: ИП Платонов Никита Дмитриевич <br>Назначение платежа необходимо заполнить следующим образом: сначала фамилия и имя ребенка, затем месяц. Например: Иванов Иван. Сентрябрь <br>Сохраните и распечатайте квитанции об оплате. <br>Совершить перевод можно через любой онлайн банк или через банкомат, а также с помощью сотрудника банка."
        timetable = formTimetable( group )
        months = formMonths()
        payinfo = formPayInfo( payments )

        res.render( 'profile', {
          layout: false,
          name: nameString,
          timetable: timetable,
          months: months,
          homework: homework,
          payinfo: payinfo,
          finances: finances
        })
      })
    })
  })  
}

function formPayInfo( payments ) {
  var result = ''

  if ( payments.length < 1 ) {
    return 'Вы ещё не произвели ни одного платежа'
  }

  var date_sort = function ( pay1, pay2 ) {
    if (pay1.date > pay2.date) return 1;
    if (pay1.date < pay2.date) return -1;
    return 0;
  }
  payments.sort( date_sort )


  var last = payments.length - 1
  var date = payments[ last ].date
  var day = date.getDate()
  var month = date.getMonth() + 1

  if ( day < 10 ) {
    day = '0' + day
  }

  if ( month < 10 ) {
    month = '0' + month
  }

  result += 'Последний платеж: '+ day + '.' + month + '.' + date.getFullYear()

  return result
}


function formMonths(  ) {
  var result = ''
  var d = new Date()
  var currentMonth = d.getMonth()
  var monthsPassed = 0
  if ( currentMonth >= 8 ) {
    monthsPassed = ( currentMonth - 8 )
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
  var res = group.timetable
  if ( res != null ) {  
    var res = res.replace(/\n/g,"<br>")  
    return res
  } else {
    return ''
  }
}
module.exports = initUser
