jQuery( function($) {
    $("#group_edit_name").on('change', function() {
        var data = $(".group_edit_form").serializeArray()
        var group_id = data.find(serialize_group_edit_id).value
        getGroup( group_id ).then( function( result ) {
            $("#group_edit_timetable").val( result.timetable )
            $("#group_edit_price").val( result.price )
        })
    })

    $(".group_edit_form").submit( function() {        
        var data = $(".group_edit_form").serializeArray()
        var group_id = data.find(serialize_group_edit_id).value
        var group_timetable = data.find(serialize_group_timetable).value
        var group_price = data.find(group_edit_price).value

        editGroup( group_id, group_timetable, group_price )
        .then( function( result ) {
            alert( result )
        })
        .catch( function( err ) {
            alert(err)
        })
        return false
    })
})

function getGroup( group_id ) {
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/getGroup', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                group_id: group_id
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

function editGroup( group_id, group_timetable, group_price ) {
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/editGroup', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                group_price: group_price,
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

function group_edit_price ( element, index, array ) {
    if ( element.name == 'group_edit_price' ) {
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
