$(document).ready(function () {
    //Retrieve projects data from server
    loadDataProjects();

    //projectlist filter
    $("#projectSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#projectList tr").filter(function () {
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



    //Save staff data to server
    $('#saveButtonStaffAddModal').click(function() {
        senStafftData();
    });

    $('#createNew').click(function() {
        console.log($('tbody').attr('id'));
    });
});

//Retrieve staffs data function
function loadDataStaffs() {
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

//Retrieve projects data function
function loadDataProjects() {
    $.ajax({
        url: 'http://localhost:1337/projects',
        type: 'GET',
        success: function (result) {
            var str = '';
            $.each(result, function (i, items) {
                //Fetch data to html table
                str += '<tr>';
                str += '<td>' + items.project_id + '</td>';
                str += '<td>' + items.project_name + '</td>';
                str += '<td>' + items.end_date + '</td>';
                str += '<td>' + items.start_date + '</td>';
                str += '<td>' + items.number_of_staffs + '</td>';
                str += '<td>' + items.status + '</td>';
                str += '<td>' + '<div class="dropdown">\
                                    <a class="btn btn-link font-24 p-0 line-height-1 no-arrow dropdown-toggle" href="#" role="button" data-toggle="dropdown">\
                                        <i class="dw dw-more"></i>\
                                    </a>\
                                    <div class="dropdown-menu dropdown-menu-right dropdown-menu-icon-list">\
                                        <a class="dropdown-item edit-modal" href="#editProjectModal" data-toggle="modal" role="button"><i class="dw dw-edit2"></i> Chỉnh sửa</a>\
                                        <a class="dropdown-item delete-modal" href="#confirmationModal" data-toggle="modal"><i class="dw dw-delete-3"></i> Xóa</a>\
                                    </div>\
                                </div>'+ '</td>';
                str += '</tr>';
            });
            //Change table on html by projects data table from above
            $('#projectList').html(str);

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

//Sent staff data function
function sentStaffData() {
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

    //Sent new staff data back to server
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

