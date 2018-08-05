jQuery( function($) {
    $("#results_swiper_right").click( function() {
        $( "#results_box" )
        .queue(function() {
            $( this )
                .fadeOut ( { queue: false } )
                .animate( { left: '+=500'}, 400 )
                .dequeue();
        })
        .animate( {left: '-=1000'}, 0 )
        .queue(function () {           
            $(this)
                .fadeIn ( { queue: false }, 1000 )
                .animate( { left: '+=500'}, 400 )
                .dequeue();
        })
    });
    $("#results_swiper_left").click( function() {
        $( "#results_box" )
        .queue(function() {
            $( this )
                .fadeOut ( { queue: false } )
                .animate( { left: '-=500'}, 400 )
                .dequeue();
        })
        .animate( {left: '+=1000'}, 0 )
        .queue(function () {           
            $(this)
                .fadeIn ( { queue: false }, 1000 )
                .animate( { left: '-=500'}, 400 )
                .dequeue();
        })
    });
});