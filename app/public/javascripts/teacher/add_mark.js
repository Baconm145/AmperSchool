jQuery( function($) {

    $("#addMarkList").on('change', function() {

        var data = $(".add_mark_form").serializeArray()

        getLessons( data[0].value ).then( function( result ) {
            var options = '<option value="" selected disabled hidden>Занятие</option>'
            var date = ''
            for ( var i = 0; i < result.length; i++ ) {
                date = new Date( result[i].date )
                date = ( '0' + date.getDate() ).slice(-2) + '.' + ( '0' + (date.getMonth()+1) ).slice(-2)
                options += '<option value="'+ result[i].id +'">' + date + '</option>'
            }
            $( "#addMarkDate" ).html( options )
        }, function( err ) {
            alert(err)
        })

        getStudents( data[0].value ).then( function( result ) {
            var options = '<option value="" selected disabled hidden>Студент</option>'
            var student = ''
            for ( var i = 0; i < result.length; i++ ) {
                student = result[i].firstname.charAt(0) + '.' + result[i].lastname
                options += '<option value="'+ result[i].id +'">' + student + '</option>'
            }
            $( "#addMarkStudent" ).html( options )
        }, function( err ) {
            alert(err)
        })
    })

    $(".add_mark_form").submit( function() {
        try {

            var data = $( this ).serializeArray()

            var lesson_id = data[1].value
            var student_id = data[2].value
            var mark = data[3].value
            var info = data[4].value

            sendMark( lesson_id, student_id, mark, info )

            return false

        } catch(err) {

            alert( 'Заполните поля!' )
            return false

        } 
    })
})


function getStudents( group_id ) {
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/getStudents', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                group_id: group_id
            }),
            success: function( students ) {
                resolve(students)
            },
            error: function( err ) {                
                reject(err)
            }
        })
    })
    return promiseResult
}

function getLessons( group_id ) {
    var promiseResult = new Promise( function(resolve, reject) {
        $.ajax({
            url: '/getLessons', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                group_id: group_id
            }),
            success: function( lessons ) {
                resolve(lessons)
            },
            error: function( err ) {                
                reject(err)
            }
        })
    })
    return promiseResult
}

function sendMark( lesson_id, student_id, mark, info ) {
    $.ajax({
        url: '/sendMark', 
        type: 'POST', 
        contentType: 'application/json', 
        data: JSON.stringify( {
            lesson_id: lesson_id,
            student_id: student_id,
            mark: mark,
            info: info
        }),
        success: function(  res ) {
            alert( 'Операция выполнена успешно!' )
        }
    })
}


