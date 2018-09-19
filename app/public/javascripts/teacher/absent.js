jQuery( function($) {
    $("#absent_group").change( function() {

        var data = $(".absent_form").serializeArray()

        console.log( data )
        console.log( data.find(serialize_group_id) )

        var group_id = data[0].value
        

        getLessons( group_id ).then( function( result ) {
            var options = '<option value="" selected disabled hidden>Занятие</option>'
            var date = ''
            for ( var i = 0; i < result.length; i++ ) {
                date = new Date( result[i].date )
                date = ( '0' + date.getDate() ).slice(-2) + '.' + ( '0' + (date.getMonth()+1) ).slice(-2)
                options += '<option value="'+ result[i].id +'">' + date + '</option>'
            }
            $( "#absent_lesson" ).html( options )
        }, function( err ) {
            alert(err)
        })

        getStudents( group_id ).then( function( result ) {
            var options = '<option value="" selected disabled hidden>Студент</option>'
            var student = ''
            for ( var i = 0; i < result.length; i++ ) {
                student = result[i].firstname.charAt(0) + '.' + result[i].lastname
                options += '<option value="'+ result[i].id +'">' + student + '</option>'
            }
            $( "#absent_student" ).html( options )
        }, function( err ) {
            alert(err)
        })
    })

    $("#absent_lesson").change( function() {
        getAbsents($(".absent_form"))
        .then( function(lesson) {
            var data = $(".absent_form").serializeArray()
            var student_id = data.find(serialize_student_id).value
            var abs = lesson.absents
            var abs_reas = lesson.absents_reasonable

            if ( abs == null ) {
                abs = []
            }
            if ( abs_reas == null ) {
                abs_reas = []
            }

            if ( abs.includes( parseInt(student_id) ) ) {
                $("#absent_absent").html(
                    '<option value="true">П</option><option value="false" selected>Н</option><option value="false_true">Н.У</option>'
                )
            } else {
                $("#absent_absent").html(
                    '<option value="true" selected>П</option><option value="false">Н</option><option value="false_true">Н.У</option>'
                )
            }

            if ( abs_reas.includes( parseInt(student_id) ) ) {
                $("#absent_absent").html(
                    '<option value="true">П</option><option value="false">Н</option><option value="false_true" selected>Н.У</option>'
                )
            }
        })
        .catch( function( err ) {
            console.log(err)
        })
    })

    $(".absent_form").submit( function() {
        var data = $(".absent_form").serializeArray()
        var lesson_id = data.find(serialize_lesson_id).value
        var student_id = data.find(serialize_student_id).value
        var absent = data.find(serialize_absent).value


        sendAbsent( lesson_id, student_id, absent ).then( function( result ) {
            alert( 'Операция выполнена успешно!' )
        })
        return false
    })

    $("#absent_student").change( function() {
        getAbsents($(".absent_form"))
        .then( function(lesson) {
            var data = $(".absent_form").serializeArray()
            var student_id = data.find(serialize_student_id).value
            var abs = lesson.absents
            var abs_reas = lesson.absents_reasonable

            if ( abs == null ) {
                abs = []
            }
            if ( abs_reas == null ) {
                abs_reas = []
            }

            if ( abs.includes( parseInt(student_id) ) ) {
                $("#absent_absent").html(
                    '<option value="true">П</option><option value="false" selected>Н</option><option value="false_true">Н.У</option>'
                )
            } else {
                $("#absent_absent").html(
                    '<option value="true" selected>П</option><option value="false">Н</option><option value="false_true">Н.У</option>'
                )
            }

            if ( abs_reas.includes( parseInt(student_id) ) ) {
                $("#absent_absent").html(
                    '<option value="true">П</option><option value="false">Н</option><option value="false_true" selected>Н.У</option>'
                )
            }

        })
        .catch( function( err ) {
            console.log(err)
        })
    })
})

function sendAbsent( lesson_id, student_id, absent ) {
    var promiseResult = new Promise( function(resolve, reject) {
        $.ajax({
            url: '/sendAbsent', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                lesson_id: lesson_id,
                student_id: student_id,
                absent: absent
            }),
            success: function( absents ) {
                resolve( absents )
            },
            error: function( err ) {                
                reject(err)
            }
        })
    })
    return promiseResult
}


function getAbsents( form ) {

    var data = form.serializeArray()

    try {
        var lesson_id = data.find(serialize_lesson_id).value
        var student_id = data.find(serialize_student_id).value
    } catch( err ) {
        return
    }
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/getAbsent', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                lesson_id: lesson_id
            }),
            success: function( absents ) {
                resolve( absents )
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


function serialize_group_id ( element, index, array ) {
    if ( element.name == 'absent_group_id' ) {
        return true
    }
    return false
}

function serialize_lesson_id ( element, index, array ) {
    if ( element.name == 'absent_lesson_id' ) {
        return true
    }
    return false
}

function serialize_student_id ( element, index, array ) {
    if ( element.name == 'absent_student_id' ) {
        return true
    }
    return false
}

function serialize_absent ( element, index, array ) {
    if ( element.name == 'absent_absent' ) {
        return true
    }
    return false
}

