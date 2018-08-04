jQuery(function ($) { 
    var currentZoom = $( window ).width() / 1280;
    $( "body" ).css({
        zoom: currentZoom
    });
    $( window ).resize(function() {
        currentZoom = $( window ).width() / 1280;
        $( "body" ).css({
            zoom: currentZoom
        });
    });
});