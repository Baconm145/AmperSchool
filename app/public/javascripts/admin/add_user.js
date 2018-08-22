jQuery( function($) {

    $(".user_form").submit( function() {
        var data = $(".user_form").serializeArray()
        try {
            var firstname = data.find(serialize_user_firstname).value
            var lastname = data.find(serialize_user_lastname).value
            var email = data.find(serialize_user_email).value
            var city = data.find(serialize_user_city).value
            var rights = data.find(serialize_user_rights).value
            var username = data.find(serialize_user_username).value
            var group_id = data.find(serialize_user_group_id).value
            var password = data.find(serialize_user_password).value

            sendUser( firstname, lastname, email, city, rights, username, group_id, password )
            .then( function( result ) {
                alert( result )
            })
            .catch( function( err ) {
                alert(err)
            })
        } catch(err) {
            alert(err)
        }
        return false
    })

    $("#user_password_generate").click( function() {
        $("#user_password").val( passwordGen() )
    })
})

function sendUser( firstname, lastname, email, city, rights, username, group_id, password ) {
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/sendUser', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                firstname: firstname,
                lastname: lastname,
                email: email,
                city: city,
                rights: rights,
                username: username,
                group_id: group_id,
                password: password
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

function serialize_user_firstname ( element, index, array ) {
    if ( element.name == 'user_firstname' ) {
        return true
    }
    return false
}

function serialize_user_lastname ( element, index, array ) {
    if ( element.name == 'user_lastname' ) {
        return true
    }
    return false
}

function serialize_user_email ( element, index, array ) {
    if ( element.name == 'user_email' ) {
        return true
    }
    return false
}

function serialize_user_city ( element, index, array ) {
    if ( element.name == 'user_city' ) {
        return true
    }
    return false
}

function serialize_user_rights ( element, index, array ) {
    if ( element.name == 'user_rights' ) {
        return true
    }
    return false
}

function serialize_user_username ( element, index, array ) {
    if ( element.name == 'user_username' ) {
        return true
    }
    return false
}

function serialize_user_group_id ( element, index, array ) {
    if ( element.name == 'user_group' ) {
        return true
    }
    return false
}

function serialize_user_password ( element, index, array ) {
    if ( element.name == 'user_password' ) {
        return true
    }
    return false
}


function passwordGen() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 7; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
