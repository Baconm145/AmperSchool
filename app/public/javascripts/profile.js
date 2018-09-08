//да, callback hell, он самый
//потом перепишу
jQuery( function($) {

    $( "#profile_general" ).children().prop( 'pressed', false )

    $( "#profile_general" ).children().mouseenter(function() {
        if ( !($(this).prop('pressed')) ) {
            $( this ).animate( {
                backgroundColor: "#3b4694",
                color: "#fffff"
            }, 100 )
        }
    } )

    $( "#profile_general" ).children().mouseleave(function() {
        if ( !($(this).prop('pressed')) ) {
            $( this ).animate( {
                backgroundColor: "transparent",
                color: "#3b4694"
            }, 100 )
        }
    } )

    $( "#profile_timetable_title" ).click(function() {

        $( "#profile_content" ).children().fadeOut( "fast" )
        
        $( this ).prop( 'pressed', true )
        $( "#profile_general" ).children().not( $(this) ).prop( 'pressed', false )

        $( "#profile_general" ).children().not( $(this) ).animate( {
            backgroundColor: "transparent",
            color: "#3b4694"
        }, 100 )  

        $( this ).animate( {
            backgroundColor: "#3b4694",
            color: "#fffff"
        }, 0 )
        
        $( "#profile_timetable_subtitle" ).fadeIn( "fast" )
        $( "#profile_timetable_content" ).fadeIn( "fast" )
    } )

    $( "#profile_finances_title" ).click(function() {

        $( "#profile_content" ).children().fadeOut( "fast" )
        
        $( this ).prop( 'pressed', true )
        $( "#profile_general" ).children().not( $(this) ).prop( 'pressed', false )

        $( "#profile_general" ).children().not( $(this) ).animate( {
            backgroundColor: "transparent",
            color: "#3b4694"
        }, 100 )

        $( this ).animate( {
            backgroundColor: "#3b4694",
            color: "#fffff"
        }, 0 )
        
        $( "#profile_finances_subtitle" ).fadeIn( "fast" )
        $( "#profile_finances_content" ).fadeIn( "fast" )
    } )

    $( "#profile_homework_title" ).click(function() {

        $( "#profile_content" ).children().fadeOut( "fast" )
        
        $( this ).prop( 'pressed', true )
        $( "#profile_general" ).children().not( $(this) ).prop( 'pressed', false )

        $( "#profile_general" ).children().not( $(this) ).animate( {
            backgroundColor: "transparent",
            color: "#3b4694"
        }, 100 )  

        $( this ).animate( {
            backgroundColor: "#3b4694",
            color: "#fffff"
        }, 0 )
        
        $( "#profile_homework_subtitle" ).fadeIn( "fast" )
        $( "#profile_homework_content" ).fadeIn( "fast" )
    } )

    
    $( "#profile_performance_title" ).click(function() {
        
        $( "#profile_content" ).children().fadeOut( "fast" )
        
        $( this ).prop( 'pressed', true )
        $( "#profile_general" ).children().not( $(this) ).prop( 'pressed', false )

        $( this ).animate( {
            backgroundColor: "#3b4694",
            color: "#fffff"
        }, 0 )

        $( "#profile_general" ).children().not( $(this) ).animate( {
            backgroundColor: "transparent",
            color: "#3b4694"
        }, 100 )        
        $( "#profile_performance_months" ).fadeIn( "fast" )
        $( "#profile_divider_2" ).fadeIn( "fast" )
    } )

    $( "#profile_performance_months" ).children().mouseenter(function() {
        if ( !($(this).prop('pressed')) ) {
            $( this ).animate( {
                backgroundColor: "#3b4694",
                color: "#fffff"
            }, 100 )
        }
    } )

    $( "#profile_performance_months" ).children().mouseleave(function() {
        if ( !($(this).prop('pressed')) ) {
            $( this ).animate( {
                backgroundColor: "transparent",
                color: "#3b4694"
            }, 100 )
        }
    } )

    $( "#profile_performance_months" ).children().click(function() {

        $( this ).prop( 'pressed', true )
        $( "#profile_performance_months" ).children().not( $(this) ).prop( 'pressed', false )

        $( this ).animate( {
            backgroundColor: "#3b4694",
            color: "#fffff"
        }, 0 )

        $( "#profile_performance_months" ).children().not( $(this) ).animate( {
            backgroundColor: "transparent",
            color: "#3b4694"
        }, 100 )

        var months = [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ]

        month = months.indexOf( $( this ).text() )

        $.ajax({
            url: '/showDates', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify({month:month}),
            success: function(  res ) {
                var date_sort = function (date1, date2) {
                    if (date1 > date2) return 1;
                    if (date1 < date2) return -1;
                    return 0;
                };

                res.sort( date_sort )

                var content = ''
                for ( var i = 0; i < res.length; i++ ) {

                    content += '<div id="profile_performance_date">'

                    var d = new Date( res[i] )
                    var day = '' + d.getDate()
                    var month = '' + ( d.getMonth() + 1 )
                    if ( d.getDate() < 10 ) {
                        day = '0' + day
                    }
                    if ( ( d.getMonth() + 1 ) < 10 ) {
                        month = '0' + month
                    }
                    content += day + '.' + month + '</div>'

                }

                var dates = $( "#profile_performance_dates" )
                dates.fadeOut( 'fast', function() {
                    dates.html( content )
                    dates.fadeIn()
                    $( "#profile_performance_dates" ).fadeIn()
                    $( "#profile_months_content" ).css( 'display', 'block' )   
                    $( "#profile_divider_3" ).fadeIn( "fast" )           

                    $( "#profile_performance_dates" ).children().mouseenter(function() {
                        if ( !($(this).prop('pressed')) ) {
                            $( this ).animate( {
                                backgroundColor: "#3b4694",
                                color: "#fffff"
                            }, 100 )
                        }
                    } )
                
                    $( "#profile_performance_dates" ).children().mouseleave(function() {
                        if ( !($(this).prop('pressed')) ) {
                            $( this ).animate( {
                                backgroundColor: "transparent",
                                color: "#3b4694"
                            }, 100 )
                        }
                    } )

                    $( "#profile_performance_dates" ).children().click(function() {

                        $( this ).prop( 'pressed', true )
                        $( "#profile_performance_dates" ).children().not( $(this) ).prop( 'pressed', false )
                
                        $( this ).animate( {
                            backgroundColor: "#3b4694",
                            color: "#fffff"
                        }, 0 )
                
                        $( "#profile_performance_dates" ).children().not( $(this) ).animate( {
                            backgroundColor: "transparent",
                            color: "#3b4694"
                        }, 100 )
                
                        $( "#profile_performance_marks" ).fadeIn( "slow" )
                
                        var date = $( this ).text()
                
                        $.ajax({
                            url: '/showMark', 
                            type: 'POST', 
                            contentType: 'application/json', 
                            data: JSON.stringify({date:date}),
                            success: function(  res ) {

                                var content = 'Посещ:'
                                if ( res[1] ) {
                                    content += ' не был<br>'
                                } else {
                                    content += ' был<br>'
                                }
                                for ( var i = 0; i < res[0].length; i++ ) {
                                    content += res[0][i].info + ': ' + res[0][i].mark + '<br>'
                                }
                                $( "#profile_performance_marks" ).fadeOut( "fast", function() {
                                    $( "#profile_performance_marks" ).html( 
                                        content
                                    )
                                    $( "#profile_performance_marks" ).fadeIn( "fast" )
                                })
                            }
                        })
                    })
                })                
            }
        })
    })   
})
