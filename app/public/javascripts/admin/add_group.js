jQuery( function($) {
    $(".group_form").submit( function() {        
        var data = $(".group_form").serializeArray()

        console.log( data )
        console.log( data.find( serialize_timetable ) )
        
        var group_name = data.find(serialize_group_name).value
        var group_price = data.find(serialize_price).value
        var group_timetable = data.find(serialize_timetable).value

        sendGroup( group_name, group_timetable, group_price )
        .then( function( result ) {
            alert( result )
        })
        .catch( function( err ) {
            alert(err)
        })
        return false
    })
})

function sendGroup( group_name, group_timetable, group_price ) {
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/sendGroup', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                group_price : group_price,
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

function serialize_timetable ( element, index, array ) {
    return element.name === "group_timetable"
}
function serialize_price ( element, index, array ) {
    return element.name === "group_price"
}

function serialize_group_name ( element, index, array ) {
    return element.name === "group_name"
}

