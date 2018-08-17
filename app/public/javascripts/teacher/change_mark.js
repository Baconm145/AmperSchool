jQuery( function($) {

    $("#changeMarkList").on('change', function() {

        var data = $(".change_mark_form").serializeArray()

        getLessons( data[0].value ).then( function( result ) {
            var options = '<option value="" selected disabled hidden>Занятие</option>'
            var date = ''
            for ( var i = 0; i < result.length; i++ ) {
                date = new Date( result[i].date )
                date = ( '0' + date.getDate() ).slice(-2) + '.' + ( '0' + (date.getMonth()+1) ).slice(-2)
                options += '<option value="'+ result[i].id +'">' + date + '</option>'
            }
            $( "#changeMarkDate" ).html( options )
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
            $( "#changeMarkStudent" ).html( options )
        }, function( err ) {
            alert(err)
        })

    })

    $("#changeMarkStudent").change( function() {

        var data = $(".change_mark_form").serializeArray()

        var markDiscr = $("#changeMarkDiscr")

        setMarksInfo( data, markDiscr )

    })

    $("#changeMarkDate").change( function() {

        var data = $(".change_mark_form").serializeArray()

        var markDiscr = $("#changeMarkDiscr")

        setMarksInfo( data, markDiscr )

    })

    $(".change_mark_form").submit( function() {
        try {
            var data = $( this ).serializeArray()

            mark = data.find(serialize_mark).value
            mark_id = data.find(serialize_mark_id).value

            changeMark( mark_id, mark ).then( function( result ) {
                var markDiscr = $("#changeMarkDiscr")
                setMarksInfo( data, markDiscr )
                alert( result )
            })

            return false

        } catch(err) {

            alert( err )
            return false

        } 
    })
})

function changeMark( mark_id, mark ) {
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/changeMark', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                mark: mark,
                mark_id: mark_id
            }),
            success: function() {
                resolve( 'Операция выполнена успешно!' )
            },
            error: function( err ) {  
                reject( err )
            }
        })
    })
    return promiseResult
}

function serialize_group_id ( element, index, array ) {
    if ( element.name == 'change_mark_group' ) {
        return true
    }
    return false
}

function serialize_mark_id ( element, index, array ) {
    if ( element.name == 'change_mark_disc' ) {
        return true
    }
    return false
}

function serialize_mark ( element, index, array ) {
    if ( element.name == 'change_mark_mark' ) {
        return true
    }
    return false
}

function serialize_lesson_id ( element, index, array ) {
    if ( element.name == 'change_mark_date' ) {
        return true
    }
    return false
}

function serialize_student_id ( element, index, array ) {
    if ( element.name == 'change_mark_student' ) {
        return true
    }
    return false
}


function setMarksInfo( data, Discr ) {
    
    try {
        var lesson_id = data.find(serialize_lesson_id).value
        var student_id = data.find(serialize_student_id).value
    } catch( err ) {
        return err
    }


    return new Promise( function( resolve, reject ){

        getMarksInfo( lesson_id, student_id )
        .then( function( result ) {

            var options = ''
            
            var mark_id
            var info = ''
            var mark 

            for ( var i = 0; i < result.length; i++  ) {

                mark_id = result[i].id
                info = result[i].info
                mark = result[i].mark

                options += '<option value="'+ mark_id +'">' + info + '(' + mark + ')' + '</option>'
            }

            Discr.html( options )

            resolve( result )
        })
        .catch( function( err ) {
            reject( err.statusText )
        })

    })

}

function getMarksInfo( lesson_id, student_id ) {
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/getMarksInfo', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                lesson_id: lesson_id,
                student_id: student_id
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
        success: function( ) {
            alert( 'Операция выполнена успешно!' )
        }
    })
}


