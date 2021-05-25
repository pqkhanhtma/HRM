$(document).ready(function () {
    //=============MAIN===========================
    //Account infomation
    loadAccountInfo();

    //Display username
    $('#displayUserName').html(localStorage.username);

    //Display user avatar
    if (localStorage.avatar) {
        $('#user_avatar').prop('src', 'http://localhost:1337' + localStorage.avatar);
    }

    //Login function
    $('#loginButton').click(function() {
        logIn();
    });

    //Logout function
    $('#logoutButton').click(function() {
        logOut();
    });

    //==============PROJECTS======================
    //Retrieve projects data from server
    loadProjectsInfo_Manager();

    //projectlist filter
    $("#projectSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#projectList tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //Save new project infomation to server
    $('#saveProjectButtonAddModal').click(function() {
        sentNewProjectInfo();
    });

    //Delete specified project
    $(document).on('click', '.delete-modal', function() {
        var id = '';
        var elementId = $(this).attr('id');
        var getRealId = elementId.substr(6);
        id += getRealId;
        $('#deleteProjectConfirmationModal').modal();
        $('#deleteProjectAcceptButton').click(function() {
            deleteSpecifiedProject(id);
        });
    });

    //==============STAFFS========================
    //Retrieve projects data from server
    loadStaffsInfo_Manager();

    //Staffslist filter
    $("#staffSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#staffList tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //Save new staff infomation to server
    $('#addStaffSaveButton').click(function() {
        sentNewStaffInfo();
    });

    //Delete specified project
    $(document).on('click', '.delete-modal', function() {
        var id = '';
        var elementId = $(this).attr('id');
        var getRealId = elementId.substr(6);
        id += getRealId;
        $('#deleteStaffConfirmationModal').modal();
        $('#deleteStaffAcceptButton').click(function() {
            deleteSpecifiedStaff(id);
        });
    });

    //========ASSIGNMENTS==================
    loadAssignmentInfo_Manager();
});


//===============STAFFS FUNCTIONS==========================
//Retrieve staffs data function for Manager
function loadStaffsInfo_Manager() {
    $.ajax({
        url: 'http://localhost:1337/staffs',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        },
        success: function (result) {
            var str = '';
            $.each(result, function (i, items) {
                //Check gender, if true gender is "Male" else "Female"
                var gender = '';
                if (items.gender === true) {
                    gender = 'Nam';
                } else {
                    gender = 'Nữ';
                }

                //Fetch data to html table
                str += '<tr>';
                str += '<td>' + items.staff_name + '</td>';
                str += '<td>' + items.birthday + '</td>';
                str += '<td>' + gender + '</td>';
                str += '<td>' + items.phone_number + '</td>';
                str += '<td>' + items.email + '</td>';
                str += '<td>' + items.address + '</td>';
                str += '<td>' + items.nationality + '</td>';
                str += '<td>' + items.role + '</td>';
                str += '<td class="dropdownMod">' + '<div class="dropdown">\
                                    <a class="btn btn-link font-24 p-0 line-height-1 no-arrow dropdown-toggle" href="#" role="button" data-toggle="dropdown">\
                                        <i class="dw dw-more"></i>\
                                    </a>\
                                    <div class="dropdown-menu dropdown-menu-right dropdown-menu-icon-list">\
                                        <a id="dataE_'+ items.id + '"' + ' class="dropdown-item edit-modal" href="#editStaffModal" data-toggle="modal" role="button"><i class="dw dw-edit2"></i> Chỉnh sửa</a>\
                                        <a id="dataR_'+ items.id + '"' + ' class="dropdown-item delete-modal" href="#confirmationModal" data-toggle="modal"><i class="dw dw-delete-3"></i> Xóa</a>\
                                    </div>\
                                </div>'+ '</td>';
                str += '</tr>';
            });
            //Change table on html by data table from above
            $('#staffList').html(str);

            //Check role
            checkRole();

            //Specified id
            var id = '';

            //Collect value that match with id and assign into modal's input
            $('#staffList').on('click', '.edit-modal', function () {
                var elementId = $(this).attr('id');
                var getRealId = elementId.substr(6);
                id = getRealId;
                for (let i in result) {
                    if (result[i].id == id) {
                        $('#staffNameEdit').val(result[i].staff_name);
                        $('#birthdayEdit').val(result[i].birthday);
                        if(result[i].gender == true) {
                            $('#genderRadioMaleEdit').prop('checked', true);
                        }else {
                            $('#genderRadioFemaleEdit').prop('checked', true);
                        }
                        $('#nationalityEdit').val(result[i].nationality);
                        $('#addressEdit').val(result[i].address);
                        $('#phoneNumberEdit').val(result[i].phone_number);
                        $('#emailEdit').val(result[i].email);
                        $('#roleSelectionEdit').val(result[i].role);
                    }
                }

                //Sent edited staff infomation
                $('#editedStaffSaveButton').click(function () {
                    sentEditedStaffInfo(id);
                });
            });
        }
    });
}

//Sent new staff infomation function
function sentNewStaffInfo() {
    //Collect value from html input elements
    var staff_name = $('#staffNameAdd').val();

    //Get value from birthday input
    var birthday = new Date($('#birthdayAdd').val() + 'UTC');
    //Convert birthday to ISO date format
    var birthdayString = birthday.toISOString();
    //Check birthdayString format
    var check_birthdayString = moment(birthdayString);
    //Convert check_birthdayString to format 'YYYY-MM-DD'
    var finalBirthday = check_birthdayString.utc().format('YYYY-MM-DD');

    //Continue collect value from html input elements
    var gender = $('input[name=genderAdd]:checked').val();
    var nationality = $('#nationalityAdd').val();
    var address = $('#addressAdd').val();
    var phone_number = $('#phoneNumberAdd').val();
    var email = $('#emailAdd').val();
    var role = $('#roleSelectionAdd').val();
    

    //Sent new staff data back to server
    $.ajax({
        url: 'http://localhost:1337/staffs',
        type: 'POST',
        headers: {
            "Authorization": "Bearer " + localStorage.token
        },
        data: {
            "staff_name": staff_name,
            "birthday": finalBirthday,
            "gender": gender,
            "phone_number": phone_number,
            "email": email,
            "address": address,
            "nationality": nationality,
            "role": role
        },
        success: function () {
            $('#addStaffModal').modal('hide');
            $('#staffStatusModalConfirmButton').show();
            $('#staffStatusModalCancelButton').hide();
            $('#staffStatusModalTitle').html('Đã thêm dữ liệu mới!')
            $('#staffStatusModal').modal();
            loadStaffsInfo_Manager();
        },
        error: function () {
            $('#staffStatusModalConfirmButton').hide();
            $('#staffStatusModalCancelButton').show();
            $('#staffStatusModalTitle').html('Không thể thêm dữ liệu mới!')
            $('#staffStatusModal').modal();
        }
    });
}

//Edit staff infomation function
function sentEditedStaffInfo(id) {
    //Collect value from html input elements
    var staff_name = $('#staffNameEdit').val();
    var birthday = new Date($('#birthdayEdit').val() + 'UTC');
    //Convert birthday long_date format into ISO_date format
    var birthdayString = birthday.toISOString();
    //Check birthday_string format
    var check_birthdayString = moment(birthdayString);
    //Convert check_birthdayString into format "YYYY-MM-DD"
    var finalBirthday = check_birthdayString.utc().format('YYYY-MM-DD');

    //Continue collect value from html input elements
    var gender = $('input[name=genderEdit]:checked').val();
    var phone_number = $('#phoneNumberEdit').val();
    var email = $('#emailEdit').val();
    var address = $('#addressEdit').val();
    var nationality = $('#nationalityEdit').val();
    var role = $('#roleSelectionEdit').val();

    $.ajax({
        url: 'http://localhost:1337/staffs/' + id,
        type: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        },
        data: {
            "staff_name": staff_name,
            "birthday": finalBirthday,
            "gender": gender,
            "phone_number": phone_number,
            "email": email,
            "address": address,
            "nationality": nationality,
            "role": role
        },
        success:function() {
            $('#editStaffModal').modal('hide');
            $('#staffStatusModalConfirmButton').show();
            $('#staffStatusModalCancelButton').hide();
            $('#staffStatusModalTitle').html('Đã cập nhật thông tin!')
            $('#staffStatusModal').modal();
            loadStaffsInfo_Manager();
        },
        error:function() {
            $('#editStaffModal').modal('hide');
            $('#staffStatusModalConfirmButton').hide();
            $('#staffStatusModalCancelButton').show();
            $('#staffStatusModalTitle').html('Không thể cập nhật thông tin!')
            $('#staffStatusModal').modal();
        }
    });
}

//Delete specified staff
function deleteSpecifiedStaff(id) {
    $.ajax({
        url: 'http://localhost:1337/staffs/' + id,
        type: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        },
        success: function() {
            $('#deleteStaffConfirmationModal').modal('hide');
            $('#staffStatusModalConfirmButton').show();
            $('#staffStatusModalCancelButton').hide();
            $('#staffStatusModalTitle').html('Đã xóa 1 bản ghi!')
            $('#staffStatusModal').modal();
            loadStaffsInfo_Manager();
        },
        error: function() {
            $('#deleteStaffConfirmationModal').modal('hide');
            $('#staffStatusModalConfirmButton').hide();
            $('#staffStatusModalCancelButton').show();
            $('#staffStatusModalTitle').html('Không thể xóa bản ghi này!')
            $('#staffStatusModal').modal();
        }
    });
}


//===============PROJECTS FUNCTIONS=========================
//Retrieve projects data function for Manager
function loadProjectsInfo_Manager() {
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
                str += '<td class="dropdownMod">' + '<div class="dropdown">\
                                    <a class="btn btn-link font-24 p-0 line-height-1 no-arrow dropdown-toggle" href="#" role="button" data-toggle="dropdown">\
                                        <i class="dw dw-more"></i>\
                                    </a>\
                                    <div class="dropdown-menu dropdown-menu-right dropdown-menu-icon-list">\
                                        <a id="dataE_'+ items.id + '"' + ' class="dropdown-item edit-modal" href="#editProjectModal" data-toggle="modal" role="button"><i class="dw dw-edit2"></i> Chỉnh sửa</a>\
                                        <a id="dataR_'+ items.id + '"' + ' class="dropdown-item delete-modal"><i class="dw dw-delete-3"></i> Xóa</a>\
                                    </div>\
                                </div>'+ '</td>';
                str += '</tr>';
            });
            //Change table on html by projects data table from above
            $('#projectList').html(str);
            
            //Check role
            checkRole();

            //Specified id
            var id = '';

            //Collect value that match with id and assign into modal's input
            $('#projectList').on('click', '.edit-modal', function () {
                var elementId = $(this).attr('id');
                var getRealId = elementId.substr(6);
                id = getRealId;
                // console.log(result.filter(el => el.id == id));
                for (let i in result) {
                    if (result[i].id == id) {
                        $('#projectNameEdit').val(result[i].project_name);
                        $('#startDateEdit').val(result[i].start_date);
                        $('#endDateEdit').val(result[i].end_date);
                        $('#numberOfStaffsEdit').val(result[i].number_of_staffs);
                    } 
                }

                //Sent edited project infomation
                $('#editedProjectSaveButton').click(function () {
                    sentEditedProjectInfo(id);
                });
            });
        }
    });
}

//Sent new project infomation function
function sentNewProjectInfo() {
    //Collect value from html input elements
    var project_id = $('#projectIdAdd').val();
    var project_name = $('#projectNameAdd').val();
    var description = $('#descriptionAdd').val();

    //Get start_date and end_date format
    var startDate = new Date($('#startDateAdd').val() + 'UTC');
    var endDate = new Date($('#endDateAdd').val() + 'UTC');
    //Convert startDate and endDate to ISO date format
    var startDateString = startDate.toISOString();
    var endDateString = endDate.toISOString();
    //Check startDateString and endDateString format
    var check_startDateString = moment(startDateString);
    var check_endDateString = moment(endDateString);
    //Convert check_startDateString and check_endDateString to format 'YYYY-MM-DD'
    var finalStartDate = check_startDateString.utc().format('YYYY-MM-DD');
    var finalEndDate = check_endDateString.utc().format('YYYY-MM-DD');

    //Continue collect value from html input elements
    var number_of_staffs = $('#numberOfStaffsAdd').val();
    var status = $('#statusSelectionAdd').val();

    //Sent new project data back to server
    $.ajax({
        url: 'http://localhost:1337/projects',
        type: 'POST',
        data: {
            "project_name": project_name,
            "description": description,
            "start_date": finalStartDate,
            "end_date": finalEndDate,
            "number_of_staffs": number_of_staffs,
            "status": status
        },
        headers: {
            'Authorization':'Bearer ' + localStorage.token
        },
        success: function () {
            $('#addProjectModal').modal('hide');
            $('#projectStatusModalConfirmButton').show();
            $('#projectStatusModalCancelButton').hide();
            $('#projectStatusModalTitle').html('Đã thêm dữ liệu mới!')
            $('#projectStatusModal').modal();
            loadProjectsInfo_Manager();
        },
        error: function () {
            $('#projectStatusModalConfirmButton').hide();
            $('#projectStatusModalCancelButton').show();
            $('#projectStatusModalTitle').html('Không thể thêm dữ liệu!')
            $('#projectStatusModal').modal();
        }
    });
}

//Edit project infomation function
function sentEditedProjectInfo(id) {
    //Collect value from html input elements
    var project_name = $('#projectNameEdit').val();
    var description = $('#descriptionAdd').val();

    //Get start_date and end_date format
    var startDate = new Date($('#startDateEdit').val() + 'UTC');
    var endDate = new Date($('#endDateEdit').val() + 'UTC');
    //Convert startDate and endDate to ISO date format
    var startDateString = startDate.toISOString();
    var endDateString = endDate.toISOString();
    //Check startDateString and endDateString format
    var check_startDateString = moment(startDateString);
    var check_endDateString = moment(endDateString);
    //Convert check_startDateString and check_endDateString to format 'YYYY-MM-DD'
    var finalStartDate = check_startDateString.utc().format('YYYY-MM-DD');
    var finalEndDate = check_endDateString.utc().format('YYYY-MM-DD');

    //Continue collect value from html input elements
    var number_of_staffs = $('#numberOfStaffsEdit').val();
    var status = $('#statusSelectionEdit').val();

    // Sent edited project data back to server
    $.ajax({
        url: 'http://localhost:1337/projects/' + id,
        type: 'PUT',
        data: {
            "project_name": project_name,
            "description": description,
            "start_date": finalStartDate,
            "end_date": finalEndDate,
            "number_of_staffs": number_of_staffs,
            "status": status
        },
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        },
        success: function () {
            $('#editProjectModal').modal('hide');
            $('#projectStatusModalConfirmButton').show();
            $('#projectStatusModalCancelButton').hide();
            $('#projectStatusModalTitle').html('Đã cập nhật thông tin!')
            $('#projectStatusModal').modal();
            loadProjectsInfo_Manager();
        },
        error: function () {
            $('#projectStatusModalConfirmButton').hide();
            $('#projectStatusModalCancelButton').show();
            $('#projectStatusModalTitle').html('Không thể cập nhật thông tin!')
            $('#projectStatusModal').modal();
        }
    });
}

//Delete specified projects
function deleteSpecifiedProject(id) {
    //Specifie project data back to server
    $.ajax({
        url: 'http://localhost:1337/projects/' + id,
        type: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        },
        success: function () {
            $('#deleteProjectConfirmationModal').modal('hide');
            $('#projectStatusModalConfirmButton').show();
            $('#projectStatusModalCancelButton').hide();
            $('#projectStatusModalTitle').html('Đã xóa!')
            $('#projectStatusModal').modal();
            loadProjectsInfo_Manager();
        },
        error: function () {
            $('#deleteProjectConfirmationModal').modal('hide');
            $('#projectStatusModalConfirmButton').hide();
            $('#projectStatusModalCancelButton').show();
            $('#projectStatusModalTitle').html('Không thể xóa!')
            $('#projectStatusModal').modal();
        }
    });
}


//===============ASSIGNMENTS FUNCTION=======================
function loadAssignmentInfo_Manager() {
    $.ajax({
        url: 'http://localhost:1337/assignments',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        },
        success: function(result) {
            str = '';
            $.each(result, function(i, items) {
                str += '<tr>';
                str += '<td>' + items.assignment_name + '</td>';
                str += '<td>' + items.staff.staff_name + '</td>';
                str += '<td>' + items.assignment_description + '</td>';
                str += '<td>' + items.assignment_end_date + '</td>';
                str += '<td>' + items.status + '</td>';
                str += '<td class="dropdownMod">' + '<div class="dropdown">\
                                    <a class="btn btn-link font-24 p-0 line-height-1 no-arrow dropdown-toggle" href="#" role="button" data-toggle="dropdown">\
                                        <i class="dw dw-more"></i>\
                                    </a>\
                                    <div class="dropdown-menu dropdown-menu-right dropdown-menu-icon-list">\
                                        <a id="dataE_'+ items.id + '"' + ' class="dropdown-item edit-modal" href="#editAssignmentModal" data-toggle="modal" role="button"><i class="dw dw-edit2"></i> Chỉnh sửa</a>\
                                        <a id="dataR_'+ items.id + '"' + ' class="dropdown-item delete-modal" href="#deleteAssignmentConfirmationModal" data-toggle="modal"><i class="dw dw-delete-3"></i> Xóa</a>\
                                    </div>\
                                </div>'+ '</td>';
                str += '</tr>';
            });
            $('#assignmentList').html(str);
        },
        error: function() {
            console.log('nope!');
        }
    });
}



//===============ACCOUNTS FUNCTIONS=========================
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
            //Set accountinfomation to local storage
            localStorage.setItem('token', result.jwt);
            localStorage.setItem('staff_name', result.user.staff.staff_name);
            localStorage.setItem('username', result.user.username);
            localStorage.setItem('email', result.user.email);
            localStorage.setItem('phone_number', result.user.staff.phone_number);
            localStorage.setItem('birthday', result.user.staff.birthday);
            localStorage.setItem('address', result.user.staff.address);
            localStorage.setItem('staff_description', result.user.staff.description);
            localStorage.setItem('Authorization', result.user.role.type);
            localStorage.setItem('role', result.user.staff.role);
            localStorage.setItem('department', result.user.department.department_name);
            //Check if user avatar availble then set user avatar to local storage
            if (result.user.user_avatar) {
                localStorage.setItem('avatar', result.user.user_avatar.formats.thumbnail.url);
            }
            $('#loginStatusModalCancelButton').hide();
            $('#loginStatusModalConfirmButton').show();
            $('#loginStatusModalTitle').html('Xin chào ' + localStorage.username);
            $('#loginStatusModal').modal();
            checkRole();
        },
        error: function () {
            $('#loginStatusModalCancelButton').show();
            $('#loginStatusModalConfirmButton').hide();
            $('#loginStatusModalTitle').html('Username hoặc mật khẩu không chính xác!');
            $('#loginStatusModal').modal();
        }
    });
}

//Logout function
function logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('staff_name');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('phone_number');
    localStorage.removeItem('birthday');
    localStorage.removeItem('address');
    localStorage.removeItem('staff_description');
    localStorage.removeItem('Authorization');
    localStorage.removeItem('role');
    localStorage.removeItem('avatar');
    localStorage.removeItem('department');
    window.location.replace('login.html');
}

//Check logged in
function checkRole() {
    if(localStorage.Authorization == 'public') {
        $('#loginStatusModalConfirmButton').click(function () {
            window.location.replace('index.html');
        });
    }else {
        $('#loginStatusModalConfirmButton').click(function () {
            window.location.replace('index3.html');
        });
    }
}

//Load account infomation
function loadAccountInfo() {
    if (localStorage.avatar) {
        $('#staffAvatar').prop('src', 'http://localhost:1337' + localStorage.avatar);
    }
    $('#staffNameAccountInfo').html(localStorage.staff_name);
    $('#staffDescription').html(localStorage.staff_description);
    $('#staffAddressAccountInfo').html(localStorage.address);
    $('#staffPhoneNumberAccountInfo').html(localStorage.phone_number);
    $('#staffEmailAccountInfo').html(localStorage.email);
    $('#staffDepartmentAccountInfo').html(localStorage.department);
}