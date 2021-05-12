$(document).ready(function () {
    //staffslist filter
    $("#staffSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#staffsTableBody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //projectlist filter
    $("#projectSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#projectsTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //Highlight selected row on table, enable and disable editbutton
    $('#tableItems tbody tr').on('click', function() {
        if($(this).hasClass('selected')) {
            $(this).css('background-color', 'white');
            $(this).removeClass('selected');
            $('#editButton').prop('disabled', true);
            
        }else {
            $('.selected').css('background-color', 'white');
            $('.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#editButton').removeAttr('disabled');
            $(this).css('background-color', 'lightgray');
        }
    });
});