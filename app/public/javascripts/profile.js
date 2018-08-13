jQuery( function($) {

    $( "#profile_general" ).children().mouseenter(function() {
        $( this ).animate( {
            backgroundColor: "#3b4694",
            color: "#fffff"
        }, 100 )
    } )

    $( "#profile_general" ).children().mouseleave(function() {
        $( this ).animate( {
            backgroundColor: "transparent",
            color: "#3b4694"
        }, 100 )
    } )

} )