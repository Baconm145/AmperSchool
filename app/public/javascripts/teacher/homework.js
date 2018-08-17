jQuery( function($) {
    $(".homework_form").submit( function() {        
        var data = $(".homework_form").serializeArray()
        var group_id = data.find(serialize_group_id).value
        var homework = data.find(serialize_homework).value

        sendHomework( group_id, homework )
        .then( function( result ) {
            alert('Операция выполнена успешно!')
        })
        .catch( function( err ) {
            alert(err)
        })
        return false
    })
})

function sendHomework( group_id, homework ) {
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/sendHomework', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                group_id: group_id,
                homework: homework
            }),
            success: function( result ) {
                resolve( result )
            },
            error: function( err ) {                
                reject(err)
            }
        })
    })
    return promiseResult
}

function serialize_group_id ( element, index, array ) {
    if ( element.name == 'homework_group_id' ) {
        return true
    }
    return false
}

function serialize_homework ( element, index, array ) {
    if ( element.name == 'homework_homework' ) {
        return true
    }
    return false
}
