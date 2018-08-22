jQuery( function($) {
    $(".group_edit_form").submit( function() {        
        var data = $(".group_edit_form").serializeArray()
        var group_id = data.find(serialize_group_edit_id).value
        var group_timetable = data.find(serialize_group_timetable).value

        editGroup( group_id, group_timetable )
        .then( function( result ) {
            alert( result )
        })
        .catch( function( err ) {
            alert(err)
        })
        return false
    })
})

function editGroup( group_id, group_timetable ) {
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/editGroup', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                group_id: group_id,
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


function serialize_group_edit_id ( element, index, array ) {
    if ( element.name == 'group_edit_name' ) {
        return true
    }
    return false
}

function serialize_group_timetable ( element, index, array ) {
    if ( element.name == 'group_edit_timetable' ) {
        return true
    }
    return false
}
