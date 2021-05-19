$(document).ready(function () {
    //Retrieve projects data from server
    loadProjectsInfo();

    //Retrieve staffs data from server
    

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

    //Login function
    $('#loginButton').click(function() {
        logIn();
    });

    //Logout function
    $('#logoutButton').click(function() {
        logOut();
    });

    //test
    $('#cancelProjectButtonAddModal').click(function() {
        getToken();
    });

    //Save new staff infomation to server
    $('#saveButtonStaffAddModal').click(function() {
        sentStaffInfo();
    });

    //Save new project infomation to server
    $('#saveProjectButtonAddModal').click(function() {
        sentProjectInfo();
    });
});

//Retrieve staffs data function
function loadStaffsInfo() {
    $.ajax({
        url: 'http://localhost:1337/',
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
                str += '<tr>';
                str += '<td>' + items.staff_id + '</td>';
                str += '<td>' + items.staff_name + '</td>';
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
function loadProjectsInfo() {
    $.ajax({
        url: 'http://localhost:1337/projects',
        type: 'GET',
        success: function (result) {
            var str = '';
            $.each(result, function (i, items) {
                //Fetch data to html table
                str += '<tr>';
                str += '<td>' + items.project_name + '</td>';
                str += '<td>' + items.start_date + '</td>';
                str += '<td>' + items.end_date + '</td>';
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

//Sent new staff infomation function
function sentStaffInfo() {
    //Get values from input elements
    var staff_id = $('#staffIdAdd').val();
    var staff_name = $('#staffNameAdd').val();
    //Get new birthday
    var birthday = new Date($('#birthdayAdd').val());
    var year = birthday.getFullYear();
    var month = birthday.getMonth() + 1;
    var newMonth = '0';
    var date = birthday.getDate();
    var newDate = '0';
    if(month <= 9) {
        newMonth += month.toString();
    }else {
        newMonth = '';
        newMonth += month.toString();
    }
    if(date <= 9) {
        newDate += date.toString();
    }else {
        newDate = '';
        newDate += date.toString();
    }
    var newBirthday = year + '-' + newMonth + '-' + newDate;
    var gender = $('input[name=gender]:checked').val();
    var nationality = $('#nationalityAdd').val();
    var address = $('#addressAdd').val();
    var phonenumber = $('#phoneNumberAdd').val();
    var email = $('#emailAdd').val();
    var role = $('#roleSelection').val();
    console.log(newMonth, typeof(newMonth), newDate, typeof(newDate))
    

    //Sent new staff data back to server
    $.ajax({
        url: 'http://localhost:1337/staffs',
        type: 'POST',
        data: {
            "staff_id": staff_id,
            "staff_name": staff_name,
            "birthday": newBirthday,
            "gender": gender,
            "phonenumber": phonenumber,
            "email": email,
            "address": address,
            "nationality": nationality,
            "role": role
        },
        success: function () {
            alert('Đã thêm dữ liệu!');
            $('#addStaffModal').modal('hide');
            loadStaffsData();
        },
        error: function () {
            alert('Nope!')
        }
    });
}

//Sent new project infomation function
function sentProjectInfo() {
    //Get values from input elements
    var project_name = $('#projectNameAdd').val();
    var description = $('#descriptionAdd').val();
    //Get start_date and end_date format
    var startDate = new Date($('#startDateAdd').val());
    var endDate = new Date($('#endDateAdd').val());
    var startYear = startDate.getFullYear();
    var endYear = endDate.getFullYear();
    var startMonth = startDate.getMonth() + 1;
    var endMonth = endDate.getMonth() + 1;
    var newStartMonth = '0'; 
    var newEndMonth = '0';
    var startDate02 = startDate.getDate();
    var endDate02 = endDate.getDate();
    var newStartDate = '0';
    var newEndDate = '0';
    if(startMonth <= 9) {
        newStartMonth += startMonth.toString();
    }else {
        newStartMonth = '';
        newStartMonth += startMonth.toString();
    }

    if(startDate02 <= 9) {
        newStartDate += startDate02.toString();
    }else {
        newStartDate = '';
        newStartDate += startDate02.toString();
    }

    if(endMonth <= 9) {
        newEndMonth += endMonth.toString();
    }else {
        newEndMonth = '';
        newEndMonth += endMonth.toString();
    }

    if(endDate02 <= 9) {
        newEndDate += endDate02.toString();
    }else {
        newEndDate = '';
        newEndDate += endDate02.toString();
    }
    var newStartDate02 = startYear + '-' + newStartMonth + '-' + newStartDate;
    var newEndDate02 = endYear + '-' + newEndMonth + '-' + newEndDate;
    var number_of_staffs = $('#numberOfStaffsAdd').val();
    var status = $('#statusSelectionAdd').val();
    
    console.log(project_name +'-'+ typeof(project_name), description +'-'+ typeof(description), 
    newStartDate02+'-'+typeof(newStartDate02), newEndDate02+'-'+typeof(newEndDate02), 
    number_of_staffs+'-'+typeof(number_of_staffs), status+'-'+typeof(status));

    //Sent new staff data back to server
    $.ajax({
        url: 'http://localhost:1337/projects',
        type: 'POST',
        data: {
            "project_name": project_name,
            "description": description,
            "start_date": newStartDate02,
            "end_date": newEndDate02,
            "number_of_staffs": number_of_staffs,
            "status": status
        },
        headers: {
            'Authorization':'Bearer ' 
        },
        success: function () {
            alert('Đã thêm dữ liệu mới!');
            $('#addProjectModal').modal('hide');
            loadProjectsInfo();
        },
        error: function () {
            alert('Đã có lỗi xảy ra trong quá trình thêm mới!')
        }
    });
}

//Login function
function logIn() {
    //Get value from username and password input
    var identifier = $('#username').val();
    var password = $('#password').val();

    $.ajax({
        url: 'http://localhost:1337/auth/local',
        type: 'POST',
        data: {
            "identifier": identifier,
            "password": password
        },
        success: function (result) {
            console.log(result);
            alert('Đăng nhập thành công!');
            window.location.replace('index3.html');
        },
        error: function() {
            alert('Username hoặc password không chính xác!');
        }
    });
}

//Get token
function getToken() {
    alert(typeof(localStorage.token));
}

//Logout function
function logOut() {
    localStorage.clear();
}

