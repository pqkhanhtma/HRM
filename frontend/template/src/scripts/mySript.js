$(document).ready(function () {
    
    //projectlist filter
    $("#projectSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#projectsTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //Staffslist filter
    $("#staffSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#staffList tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //Retrieve data from server
    loadData();

    //Save data to server
    $('#saveButtonStaffAddModal').click(function() {
        sentData();
    });

    $('#createNew').click(function() {
        console.log($('tbody').attr('id'));
    });
});

//Retrieve data function
function loadData() {
    $.ajax({
        url: 'http://localhost:1337/staffs',
        type: 'GET',
        success: function (result) {
            var str = '';
            $.each(result, function (i, items) {
                //Check gender, if true gender is "Male" else "Female"
                var gender = '';
                if(items.gender === true) {
                    gender = 'Nam';
                }else {
                    gender = 'Nữ';
                }

                //Fetch data to html table
                str += '<tr id="'+ items.id +'">';
                str += '<td>' + items.staffs_id + '</td>';
                str += '<td>' + items.staffs_name + '</td>';
                str += '<td>' + items.birthday + '</td>';
                str += '<td>' + gender + '</td>';
                str += '<td>' + items.phonenumber + '</td>';
                str += '<td>' + items.email + '</td>';
                str += '<td>' + items.address + '</td>';
                str += '<td>' + items.nationality + '</td>';
                str += '<td>' + items.role + '</td>';
                str += '<td>' + '<div class="dropdown">\
                                    <a class="btn btn-link font-24 p-0 line-height-1 no-arrow dropdown-toggle" href="#" role="button" data-toggle="dropdown">\
                                        <i class="dw dw-more"></i>\
                                    </a>\
                                    <div class="dropdown-menu dropdown-menu-right dropdown-menu-icon-list">\
                                        <a class="dropdown-item edit-modal" href="#editStaffModal" data-toggle="modal" role="button"><i class="dw dw-edit2"></i> Chỉnh sửa</a>\
                                        <a class="dropdown-item delete-modal" href="#confirmationModal" data-toggle="modal"><i class="dw dw-delete-3"></i> Xóa</a>\
                                    </div>\
                                </div>'+ '</td>';
                str += '</tr>';
            });
            //Change table on html by data table from above
            $('#staffList').html(str);

            // //Highlight selected row on table
            // $('#staffList tr').on('click', function () {
            //     if ($(this).hasClass('selected')) {
            //         $(this).removeClass('selected');

            //     } else {
            //         $('.selected').removeClass('selected');
            //         $(this).addClass('selected');
            //     }
            // });
        }
    });
}

//Retrieve data by id function
function editData(id) {
    $.ajax({
        url: 'http://localhost:1337/staffs/' + id,
        type: 'PUT',
        data: {
            
        },
        success: function() {
            
        }
    });
}

//Sent data function
function sentData() {
    //Get values from input elements
    var staffs_id = $('#staffIdAdd').val();
    var staffs_name = $('#staffNameAdd').val();
    var birthday = $('#birthdayAdd').datepicker({dateFormat: 'yyyy-mm-dd'}).val();
    var gender = $('input[name=gender]:checked').val();
    var nationality = $('#nationalityAdd').val();
    var address = $('#addressAdd').val();
    var phonenumber = $('#phoneNumberAdd').val();
    var email = $('#emailAdd').val();
    var role = $('#roleSelection').val();  

    $.ajax({
        url: 'http://localhost:1337/staffs',
        type: 'POST',
        data: {
            "staffs_id": staffs_id,
            "staffs_name": staffs_name,
            "gender": gender,
            "phonenumber": phonenumber,
            "email": email,
            "address": address,
            "nationality": nationality,
            "role": role
        },
        success: function () {
            alert('Đã thêm dữ liệu!');
            loadData();
        },
        error: function () {
            alert('Nope!')
        }
    });
}