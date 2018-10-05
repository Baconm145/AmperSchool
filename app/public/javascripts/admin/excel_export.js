jQuery( function($) {
    /*
    $("#excel_group").on('change', function() {

        var excel_data = $(".excel_form").serializeArray()

        var group_id_excel = excel_data.find(serialize_group_id_excel).value

        getStudents( group_id_excel ).then( function( result ) {
            var options = '<option value="" selected disabled hidden>Ученик</option>'
            var student = ''
            for ( var i = 0; i < result.length; i++ ) {
                student = result[i].firstname.charAt(0) + '.' + result[i].lastname
                options += '<option value="'+ result[i].id +'">' + student + '</option>'
            }
            $( "#excel_user" ).html( options )
        }, function( err ) {
            alert(err)
        })
       
    })
    */



    $(".excel_form").submit( function() {

        var excel_data = $(".excel_form").serializeArray()

        var url_group_name = $("#excel_group").find('option:selected').text()
        var url_month_name = $("#excel_month").find('option:selected').text()

        var group_id_excel = excel_data.find(serialize_group_id_excel)
        var month_excel = excel_data.find(serialize_month_excel)

        if ( group_id_excel == undefined || month_excel == undefined ) {
            alert( 'Заполните все поля!' )
        } else {

            SendExcelData( group_id_excel, month_excel ).then( function( status ) {
                
                var data = { 'group': url_group_name, 'month': url_month_name };            

                DownloadExcel("/getExcelData?" + encodeQueryData(data) )

            }, function( err ) {
                console.log(err)
            })

        }
        return false
    })
})

function encodeQueryData(data) {
    let ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
 }

function DownloadExcel( url ) {
    document.getElementById('my_iframe').src = url;
}

function SendExcelData( group_id_excel, month_excel, student_excel ) {
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/formExcelData', 
            type: 'POST', 
            contentType: 'application/json',
            data: JSON.stringify( {
                group_id_excel: group_id_excel,
                month_excel: month_excel
            }),
            success: function( status ) {
                resolve( status )
            },
            error: function( err ) {                
                reject( err )
            }
        })
    })
    return promiseResult
}


function GetStudents( group_id ) {
    var promiseResult = new Promise( function( resolve, reject ) {
        $.ajax({
            url: '/getStudents', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify( {
                group_id: group_id
            }),
            success: function( students ) {
                resolve(students)
            },
            error: function( err ) {                
                reject(err)
            }
        })
    })
    return promiseResult
}


function serialize_group_id_excel ( element, index, array ) {
    if ( element.name == 'excel_group' ) {
        return true
    }
    return false
}
function serialize_month_excel ( element, index, array ) {
    if ( element.name == 'excel_month' ) {
        return true
    }
    return false
}
function serialize_student_excel ( element, index, array ) {
    if ( element.name == 'excel_user' ) {
        return true
    }
    return false
}