
jQuery( function($) {
    $("#start_enter").click( function() {
        if ( $("#start_auth_window").attr('style')==="display: block;" ) {
            $("#start_auth_window").slideUp("slow");
        } else {
            $("#start_auth_window").slideDown("slow");
        }
    });
    $("#unauthorized").click( function() {
        $("#loader").fadeIn ( { queue: false }, 150 )
    });
    $.get( "/login" )
        .done(function( data ) {
            alert( "Data Loaded: " + data );
        });
});
    