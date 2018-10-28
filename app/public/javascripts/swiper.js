var current = 0;
names = [
    'Захар Логинов',
    'Егор Хлопин',
    'Илья Гуревич',
    'Дмитрий Фёдоров'
]
disc = [
    'Получил результат <b>100 баллов</b> за ЕГЭ по физике.<br><br>Поступил в Санкт-Петербургский <b>Политехнический университет</b>',
    'Получил результат в <b>96 баллов</b> за ЕГЭ по физике<br><br>Поступил в <b>МГТУ им. Баумана</b>',
    'Набрал на ЕГЭ по физике <b>85 баллов</b>.<br><br>Поступил в Санкт-Петербургский <b>Горный университет</b>',
    'Набрал на ЕГЭ по физике <b>80 баллов</b>.<br><br>Поступил в Санкт-Петербургский <b>Политехнический университет</b>'
]
jQuery( function($) {
    $("#results_swiper_right").click( function() {   
        if ( $("#results_box").queue("fx").length == 0 ) {
            $( "#results_box" )
            .queue(function() {
                $( this )
                    .fadeOut ( { queue: false } )
                    .animate( { left: '+=500'}, 400 )
                    .dequeue();
            })
            .animate( {left: '-=1000'}, 0 )
            if ( current == 3 ) {
                current = 0;
            } else {
                current++;
            };
            $( "#results_box" ).queue(function () {                
                $( '#results_photo' ).attr( 'src','images/photo_results_'+ current.toString() +'.png' )
                $( '#results_content' ).html( disc[current] )
                $( '#results_student_name' ).html( names[current] )
                $(this)
                    .fadeIn ( { queue: false }, 1000 )
                    .animate( { left: '+=500'}, 400 )
                    .dequeue();
            });
        };
    });
    $("#results_swiper_left").click( function() {
        if ( $("#results_box").queue("fx").length == 0 ) {
            $( "#results_box" )
            .queue(function() {
                $( this )
                    .fadeOut ( { queue: false } )
                    .animate( { left: '-=500'}, 400 )
                    .dequeue();
            })
            .animate( {left: '+=1000'}, 0 )
            if ( current == 0 ) {
                current = 3;
            } else {
                current--;
            };
            $( "#results_box" ).queue(function () {
                $( '#results_photo' ).attr( 'src','images/photo_results_'+ current.toString() +'.png' )
                $( '#results_content' ).html( disc[current] )
                $( '#results_student_name' ).html( names[current] )      
                $(this)
                    .fadeIn ( { queue: false }, 1000 )
                    .animate( { left: '-=500'}, 400 )
                    .dequeue();
            });
        };
    });
    $("#social_networks_rectangle_white_left").click(function() {
        window.location = "https://vk.com/amper11";
    });
    $("#social_networks_rectangle_white_right").click(function() {
        window.location = "https://www.instagram.com/amper_school/";
    });
    $("#pricelist_rectangle_rounded_1").click(function() {
        $("#application_rectangle_rounded_1").get(0).scrollIntoView( { behavior: 'smooth' } );
    });
    $("#pricelist_rectangle_rounded_2").click(function() {
        $("#application_rectangle_rounded_1").get(0).scrollIntoView( { behavior: 'smooth' } );
    });
    $("#pricelist_rectangle_rounded_3").click(function() {
        $("#application_rectangle_rounded_1").get(0).scrollIntoView( { behavior: 'smooth' } );
    });
    $("#start_rectangle_rounded").click(function() {
        $("#application_rectangle_rounded_1").get(0).scrollIntoView( { behavior: 'smooth' } );
    });
});