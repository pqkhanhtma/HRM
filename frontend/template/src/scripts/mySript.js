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

    // //Highlight selected row on table, enable and disable editbutton
    // $('#tableItems tbody tr').on('click', function() {
    //     if($(this).hasClass('selected')) {
    //         $(this).removeAttr('style');
    //         $(this).removeClass('selected');
    //         $('#editButton').prop('disabled', true);
            
    //     }else {
    //         $('.selected').removeAttr('style');
    //         $('.selected').removeClass('selected');
    //         $(this).addClass('selected');
    //         $('#editButton').removeAttr('disabled');
    //         $(this).css('background-color', 'lightgray');
    //     }
    // });

    //Modal arlet
    $('.delete-modal').click(function() {
        $('#confirmation-modal').modal();
    });

    //Enable field in staff_info.html
    $('#sti_editButton').click(function() {
        $('#collapseForm').collapse('show');
        $('#sti_infoForm input').prop('disabled', false);
    });
    $('#sti_cancelButton').click(function() {
        $('#sti_infoForm input').prop('disabled', true);
        $('#collapseForm').collapse('hide');
    });
});