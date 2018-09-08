jQuery( function($) {
    $(".create_payment_form").submit( function() {        
        var data = $(".create_payment_form").serializeArray()
        var amount = data.find(serialize_create_payment_amount).value

        createPayment( amount )
        .then( function( result ) {
            console.log( result )
        })
        .catch( function( err ) {
            console.log( err )
        })
        return false
    })
})

function createPayment( amount ) {
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/createPayment', 
            type: 'POST',
            contentType: 'application/json', 
            data: JSON.stringify( {
                amount: amount
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


function serialize_create_payment_amount ( element, index, array ) {
    if ( element.name == 'create_payment' ) {
        return true
    }
    return false
}
