jQuery( function($) {
    $(".group_form").submit( function() {        
        var data = $(".group_form").serializeArray()
        var group_name = data.find(serialize_group_name).value
        var group_timetable = data.find(serialize_group_timetable).value

        sendGroup( group_name, group_timetable )
        .then( function( result ) {
            alert( result )
        })
        .catch( function( err ) {
            alert(err)
        })
        return false
    })
})

function sendGroup( group_name, group_timetable ) {
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/sendGroup', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                group_name: group_name,
                group_timetable: group_timetable
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


function serialize_group_name ( element, index, array ) {
    if ( element.name == 'group_name' ) {
        return true
    }
    return false
}

function serialize_group_timetable ( element, index, array ) {
    if ( element.name == 'group_timetable' ) {
        return true
    }
    return false
}
