jQuery( function($) {
    $(".add_lesson_form").submit( function() {
        try {

            var data = $( this ).serializeArray()
            var date = data[0].value
            var group_id = data[1].value
            var d = new Date()
        
            date = date.substring( 3, 5 ) + '.' + date.substring( 0, 2 ) + '.' + d.getFullYear()
            date = new Date( date )
            date.setDate( date.getDate() )
            date.setHours( '12' )

            sendLesson( group_id, date )
            return false

        } catch(err) {

            alert( 'Заполните поля!' )
            return false

        } 
    })

})

function sendLesson( group_id, date ) {
    $.ajax({
        url: '/sendLesson', 
        type: 'POST', 
        contentType: 'application/json', 
        data: JSON.stringify( {
            group_id: group_id,
            date: date
        }),
        success: function(  res ) {
            alert( 'Операция выполнена успешно!' )
        }
    })
}
