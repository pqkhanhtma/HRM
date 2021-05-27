$(document).ready(function () {
    //=============MAIN===========================
    //Account infomation
    loadAccountInfo();

    $('#assignmentStaffList').on('change', function() {
        console.log($('#assignmentStaffList').val());
    });

    //Display username
    $('#displayUserName').html(localStorage.username);

    //Display user avatar
    if (localStorage.avatar) {
        $('#userAvatar').prop('src', 'http://localhost:1337' + localStorage.avatar);
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
    loadProjectsInfo_Employee();

    //projectlist filter
    $("#projectSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        //For Manager template
        $("#projectListManager tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
        //For Employee emplate
        $("#projectListEmployee tr").filter(function () {
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

    //Delete specified staff
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
    //Retrieve assignments data from server
    var getId = localStorage.staff_id;
    loadAssignmentInfo_Employee(getId);
    loadAssignmentInfo_Manager();;  

    //Assignment filter
    $("#assignmentSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        //For Employee template
        $("#assignmentListEmployee tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
        //For Manager template
        $("#assignmentListManager tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //Save new assignment infomation to server
    $('#saveAssignmentButtonAddModal').click(function() {
        sentNewAssignmentInfo();
    });

    //Delete specified assignment 
    $('#assignmentListManager').on('click', '.delete-modal', function() {
        var id = '';
        var elementId = $(this).attr('id');
        var getRealId = elementId.substr(6);
        id += getRealId;
        console.log(id);
        $('#deleteAssignmentConfirmationModal').modal();
        $('#deleteAssignmentAcceptButton').click(function() {
            deleteSpecifiedAssignment(id);
        });
    });


    //========REPORTS==================
    //Retrieve report data from server
    loadReportInfo_Manager();
    loadReportInfo_Employee();

    //Report filter
    $("#reportSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        //For Employee template
        $("#reportListEmployee tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
        //For Manager template
        $("#reportListManager tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //Save new report information to server
    $('#saveReportButtonAddModal').click(function() {
        sentNewReportInfo();
    });

    //Save edited report infomation back to server
    var reportId = '';
    $('#reportListEmployee').on('click', '.edit-modal', function() {
        var elementId = $(this).attr('id');
        var getRealId = elementId.substr(6);
        reportId = getRealId;
        loadSpecifiedStaffInfo(reportId);
    });

    //Delete specified report
    $('#reportListEmployee').on('click', '.delete-modal', function() {
        var elementId = $(this).attr('id');
        var getRealId = elementId.substr(6);
        reportId = getRealId;
        console.log(reportId);
        $('#deleteReportConfirmationModal').modal();
        $('#deleteReportAcceptButton').click(function() {
            deleteSpecifiedReport_Employee(reportId);
        });
    });


    //===========DEPARTMENTS==============
    //Retrieve department data from server
    loadDepartmentInfo();

    //Department filter
    $("#departmentSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#departmentList tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //Sent new department infomation to server
    $('#saveDepartmentButtonAddModal').click(function() {
        sentNewDepartmentInfo();
    });

    //Delete specified department
    var departmentId = '';
    $('#departmentList').on('click', '.delete-modal', function() {
        var elementId = $(this).attr('id');
        var getRealId = elementId.substr(6);
        departmentId = getRealId;
        console.log(departmentId);
        $('#deleteDepartmentConfirmationModal').modal();
        $('#deleteDepartmentAcceptButton').click(function() {
            deleteSpecifiedDepartment(departmentId);
        });
    });
    
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
            //Collect staff list from database and display on #staffList table
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

            //Collect specified staff infomation and bring data into create assignment modal input
            $('#addAssignmentModal').on('show.bs.modal', function () {
                var staffListSelectTagAdd = document.getElementById('assignmentStaffListAdd');
                for (var i = 0; i < result.length; i++) {
                    //Create option list for #assignmentStaffListAdd select tag
                    var staffListOptionTagAdd = document.createElement('option');
                    staffListOptionTagAdd.innerHTML = result[i].staff_name;
                    staffListOptionTagAdd.value = result[i].id;
                    staffListSelectTagAdd.appendChild(staffListOptionTagAdd);
                }
            });
            //Clear option tag after closing modal to prevent duplicate values
            $('#addAssignmentModal').on('hidden.bs.modal', function() {
                $('#assignmentStaffListAdd option').remove();
            });
            //Collect specified staff infomation and bring data into edit assignment modal input
            $('#editAssignmentModal').on('show.bs.modal', function() {
                var staffListSelectTagEdit = document.getElementById('assignmentStaffListEdit');
                for (var i = 0; i < result.length; i++) {
                    //Create option list for #assignmentStaffListEdit select tag
                    var staffListOptionTagEdit = document.createElement('option');
                    staffListOptionTagEdit.innerHTML = result[i].staff_name;
                    staffListOptionTagEdit.value = result[i].id;
                    staffListSelectTagEdit.appendChild(staffListOptionTagEdit);
                }
            });
            //Clear option tag after closing modal to prevent duplicate values
            $('#editAssignmentModal').on('hidden.bs.modal', function() {
                $('#assignmentStaffListEdit option').remove();
            });
        }
    });
}

//Retrieve specified staff function for Employee
function loadSpecifiedStaffInfo(reportId) {
    $.ajax({
        url: 'http://localhost:1337/staffs/' + localStorage.staff_id,
        type: 'GET',
        success: function(result) {
            var reportArray = result.reports;
            for(let i in reportArray) {
                if(reportId == reportArray[i].id) {
                    $('#reportTitleEdit').val(reportArray[i].report_title);
                    $('#reportDescriptionEdit').val(reportArray[i].report_content);
                    $('#reportProjectListEdit').val(reportArray[i].project);
                    $('#saveReportButtonEditModal').click(function() {
                        sentEditedReportInfo(reportArray[i].id);
                    });
                }
            }
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
            $('#staffStatusModalTitle').html('Đã thêm ' + staff_name + ' vào danh sách nhân viên!')
            $('#staffStatusModal').modal();
            loadStaffsInfo_Manager();
        },
        error: function () {
            $('#staffStatusModalConfirmButton').hide();
            $('#staffStatusModalCancelButton').show();
            $('#staffStatusModalTitle').html('Không thể thêm ' + staff_name + ' vào danh sách nhân viên!')
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
            $('#staffStatusModalTitle').html('Đã cập nhật thông tin cho ' + staff_name);
            $('#staffStatusModal').modal();
            loadStaffsInfo_Manager();
        },
        error:function() {
            $('#editStaffModal').modal('hide');
            $('#staffStatusModalConfirmButton').hide();
            $('#staffStatusModalCancelButton').show();
            $('#staffStatusModalTitle').html('Không thể cập nhật thông tin cho ' + staff_name);
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
            $('#staffStatusModalTitle').html('Đã xóa nhân viên!')
            $('#staffStatusModal').modal();
            loadStaffsInfo_Manager();
        },
        error: function() {
            $('#deleteStaffConfirmationModal').modal('hide');
            $('#staffStatusModalConfirmButton').hide();
            $('#staffStatusModalCancelButton').show();
            $('#staffStatusModalTitle').html('Không thể xóa nhân viên này!')
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
            //Collect project list from database and display on #projectList table
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
            $('#projectListManager').html(str);

            //Specified id
            var id = '';

            //Collect value that match with id and assign into modal's input
            $('#projectListManager').on('click', '.edit-modal', function () {
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

            //Collect specified project infomation and bring data into create assignment modal input
            $('#addAssignmentModal').on('show.bs.modal', function () {
                var projectListSelectTagAdd = document.getElementById('assignmentProjectListAdd');
                for (var i = 0; i < result.length; i++) {
                    //Create option list for #assignmentProjectListAdd select tag
                    var projectListOptionTagAdd = document.createElement('option');
                    projectListOptionTagAdd.innerHTML = result[i].project_name;
                    projectListOptionTagAdd.value = result[i].id;
                    projectListSelectTagAdd.appendChild(projectListOptionTagAdd);
                }
            });
            //Clear option tag after closing modal to prevent duplicate values
            $('#addAssignmentModal').on('hidden.bs.modal', function () {
                $('#assignmentProjectListAdd option').remove();
            });
            //Collect specified project infomation and bring data into edit assignment modal input
            $('#editAssignmentModal').on('show.bs.modal', function () {
                var projectListSelectTagEdit = document.getElementById('assignmentProjectListEdit');
                for (var i = 0; i < result.length; i++) {
                    //Create option list for #assignmentProjectListEdit select tag
                    var projectListOptionTagEdit = document.createElement('option');
                    projectListOptionTagEdit.innerHTML = result[i].project_name;
                    projectListOptionTagEdit.value = result[i].id;
                    projectListSelectTagEdit.appendChild(projectListOptionTagEdit);
                }
            });
            //Clear option tag after closing modal to prevent duplicate values
            $('#editAssignmentModal').on('hidden.bs.modal', function () {
                $('#assignmentProjectListEdit option').remove();
            });


            //Collect specified project infomation and bring data into create report modal input
            $('#addReportModal').on('show.bs.modal', function () {
                var reportProjectListSelectTagAdd = document.getElementById('reportProjectListAdd');
                for (var i = 0; i < result.length; i++) {
                    //Create option list for #reportProjectListAdd select tag
                    var reportProjectListOptionTagAdd = document.createElement('option');
                    reportProjectListOptionTagAdd.innerHTML = result[i].project_name;
                    reportProjectListOptionTagAdd.value = result[i].id;
                    reportProjectListSelectTagAdd.appendChild(reportProjectListOptionTagAdd);
                }
            });
            //Clear option tag after closing modal to prevent duplicate values
            $('#addReportModal').on('hidden.bs.modal', function () {
                $('#reportProjectListAdd option').remove();
            });
            //Collect specified project infomation and bring data into edit report modal input
            $('#editReportModal').on('show.bs.modal', function () {
                var reportProjectListSelectTagEdit = document.getElementById('reportProjectListEdit');
                for (var i = 0; i < result.length; i++) {
                    //Create option list for #reportProjectListEdit select tag
                    var reportProjectListOptionTagEdit = document.createElement('option');
                    reportProjectListOptionTagEdit.innerHTML = result[i].project_name;
                    reportProjectListOptionTagEdit.value = result[i].id;
                    reportProjectListSelectTagEdit.appendChild(reportProjectListOptionTagEdit);
                }
            });
            //Clear option tag after closing modal to prevent duplicate values
            $('#editReportModal').on('hidden.bs.modal', function () {
                $('#reportProjectListEdit option').remove();
            });
        }
    });
}

//Retrieve projects data function for Employee
function loadProjectsInfo_Employee() {
    $.ajax({
        url: 'http://localhost:1337/projects',
        type: 'GET',
        success: function (result) {
            //Collect project list from database and display on #projectList table
            var str = '';
            $.each(result, function (i, items) {
                //Fetch data to html table
                str += '<tr>';
                str += '<td>' + items.project_name + '</td>';
                str += '<td>' + items.start_date + '</td>';
                str += '<td>' + items.end_date + '</td>';
                str += '<td>' + items.number_of_staffs + '</td>';
                str += '<td>' + items.status + '</td>';
                str += '</tr>';
            });
            //Change table on html by projects data table from above
            $('#projectListEmployee').html(str);
        },
        error: function() {
            console.log('Load data failed!');
        }
    });
}

//Sent new project infomation function
function sentNewProjectInfo() {
    //Collect value from html input elements
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
            $('#projectStatusModalTitle').html('Đã thêm ' + project_name + ' vào danh sách dự án!');
            $('#projectStatusModal').modal();
            loadProjectsInfo_Manager();
        },
        error: function () {
            $('#projectStatusModalConfirmButton').hide();
            $('#projectStatusModalCancelButton').show();
            $('#projectStatusModalTitle').html('Không thể thêm ' + project_name + ' vào danh sách dữ liệu!');
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
            $('#projectStatusModalTitle').html('Đã cập nhật thông tin cho ' + project_name + '!');
            $('#projectStatusModal').modal();
            loadProjectsInfo_Manager();
        },
        error: function () {
            $('#projectStatusModalConfirmButton').hide();
            $('#projectStatusModalCancelButton').show();
            $('#projectStatusModalTitle').html('Không thể cập nhật thông tin cho ' + project_name + '!');
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


//===============ASSIGNMENTS FUNCTIONS======================
//Retrieve assignments data function for Manager
function loadAssignmentInfo_Manager() {
    //Collect assignment list from database and display on #assignmentList table
    $.ajax({
        url: 'http://localhost:1337/assignments',
        type: 'GET',
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
            //Change table on html by projects data table from above
            $('#assignmentListManager').html(str);

            //Specified id
            var id = '';

            //Collect value that match with id and assign into modal's input
            $('#assignmentListManager').on('click', '.edit-modal', function() {
                var elementId = $(this).attr('id');
                var getRealId = elementId.substr(6);
                id = getRealId;
                for(let i in result) {
                    if(result[i].id == id) {
                        $('#assignmentTitleEdit').val(result[i].assignment_name);
                        $('#assignmentDescriptionEdit').val(result[i].assignment_description);
                        $('#assignmentEndDateEdit').val(result[i].assignment_end_date);
                        $('#assignmentStatusSelectionEdit').val(result[i].status);
                    }
                }

                //Sent edited assignment infomation
                $('#saveAssignmentButtonEditModal').click(function() {
                    sentEditedAssignmentInfo(id);
                });
            });
        }
    });
}

//Retrieve assignments data function for Employee
function loadAssignmentInfo_Employee(id) {
    $.ajax({
        url: 'http://localhost:1337/staffs/' + id,
        type: 'GET',
        success: function(result) {
            str = '';
            var staffAssignmentArray = result.assignments;
            if(staffAssignmentArray.length == 0) {
                str += '<tr>';
                str += '<td class="text-center" colspan = "4">Bạn hiện đang không có nhiệm vụ nào</td>'
                str += '</tr>';
            }else {
                for(let i in staffAssignmentArray) {
                    str += '<tr>';
                    str += '<td>' + staffAssignmentArray[i].assignment_name + '</td>';
                    str += '<td>' + staffAssignmentArray[i].assignment_description + '</td>';
                    str += '<td>' + staffAssignmentArray[i].assignment_end_date + '</td>';
                    str += '<td>' + staffAssignmentArray[i].status + '</td>';
                    str += '</tr>';
                };
            }
            $('#assignmentListEmployee').html(str);
        },
        error: function() {
            console.log("load data Failed!");
        }
    });
}

//Sent new assignment infomation function
function sentNewAssignmentInfo() {
    //Collect value of html input tag from create new assignment modal
    var assignment_name = $('#assignmentTitleAdd').val();
    var assignment_description = $('#assignmentDescriptionAdd').val();
    var status = $('#assignmentStatusSelectionAdd').val();
    var specified_staff = $('#assignmentStaffListAdd').val();
    var specified_project = $('#assignmentProjectListAdd').val()

    //Collect assignment end date from date input of create new assignment modal
    var assignmentEndDate = new Date($('#assignmentEndDateAdd').val() + 'UTC');
    //Convert assignmentEndDate into ISO date format
    var assignmentEndDateString = assignmentEndDate.toISOString();
    //Check assignmentEndDateString format
    var check_assignmentEndDateString = moment(assignmentEndDateString);
    //Convert check_assignmentEndDateString to format 'YYYY-MM-DD'
    var finalAssignmentEndDate = check_assignmentEndDateString.utc().format('YYYY-MM-DD');

    $.ajax({
        url: 'http://localhost:1337/assignments',
        type: 'POST',
        headers: {
            'Authorization' : 'Bearer ' + localStorage.token
        },
        data: {
            "assignment_name" : assignment_name,
            "assignment_description" : assignment_description,
            "status" : status,
            "assignment_end_date" : finalAssignmentEndDate,
            "staff" : {
                "id" : specified_staff
            },
            "project" : {
                "id" : specified_project
            }
        },
        success: function() {
            $('#addAssignmentModal').modal('hide');
            $('#assignmentStatusModalConfirmButton').show();
            $('#assignmentStatusModalCancelButton').hide();
            $('#assignmentStatusModalTitle').html('Đã thêm nhiệm vụ mới!')
            $('#assignmentStatusModal').modal();
            loadAssignmentInfo_Manager();
        },
        error: function() {
            $('#assignmentStatusModalConfirmButton').hide();
            $('#assignmentStatusModalCancelButton').show();
            $('#assignmentStatusModalTitle').html('Không thể thêm nhiệm vụ mới!')
            $('#assignmentStatusModal').modal();
        }
    });
}

//Sent Edited assignment infomation function
function sentEditedAssignmentInfo(id) {
    //Collect value of html input tag from assignment edit modal
    var assignment_name = $('#assignmentTitleEdit').val();
    var assignment_description = $('#assignmentDescriptionEdit').val();
    var status = $('#assignmentStatusSelectionEdit').val();
    var specified_staff = $('#assignmentStaffsEdit').val();
    var specified_project = $('#assignmentProjectListEdit').val();

    //Collect assignment end date from date input of edit assignment modal
    var assignmentEndDate = new Date($('#assignmentEndDateEdit').val() + 'UTC');
    //Convert assignmentEndDate to ISO format
    var assignmentEndDateString = assignmentEndDate.toISOString();
    //Check assignmentEndDateString format
    var check_assignmentEndDate = moment(assignmentEndDateString);
    //convert check_assignmentEndDateString to format 'YYYY-MM-DD'
    var finalAssignmentEndDate = check_assignmentEndDate.utc().format('YYYY-MM-DD');

    // Sent edited project data back to server
    $.ajax({
        url : 'http://localhost:1337/assignments/' + id,
        type: 'PUT',
        headers: {
            'Authorization' : 'Bearer ' + localStorage.token
        },
        data: {
            "assignment_name" : assignment_name,
            "assignment_description": assignment_description,
            "status" : status,
            "staff" : {
                "id" : specified_staff
            },
            "project" : {
                "id" : specified_project
            },
            "assignment_end_date" : finalAssignmentEndDate
        },
        success: function() {
            $('#editAssignmentModal').modal('hide');
            $('#assignmentStatusModalConfirmButton').show();
            $('#assignmentStatusModalCancelButton').hide();
            $('#assignmentStatusModalTitle').html('Đã chỉnh sửa thông tin nhiệm vụ ' + assignment_name + '!');
            $('#assignmentStatusModal').modal();
            loadAssignmentInfo_Manager();
        },
        error: function() {
            $('#assignmentStatusModalConfirmButton').hide();
            $('#assignmentStatusModalCancelButton').show();
            $('#assignmentStatusModalTitle').html('Không thể chỉnh sửa thông tin nhiệm vụ ' + assignment_name + '!');
            $('#assignmentStatusModal').modal();
        }
    });
}

//Delete specified assignment
function deleteSpecifiedAssignment(id) {
    $.ajax({
        url : 'http://localhost:1337/assignments/' + id,
        type: 'DELETE',
        headers: {
            'Authorization' : 'Bearer ' + localStorage.token
        },
        success: function() {
            $('#deleteAssignmentConfirmationModal').modal('hide');
            $('#assignmentStatusModalConfirmButton').show();
            $('#assignmentStatusModalCancelButton').hide();
            $('#assignmentStatusModalTitle').html('Đã xóa nhiệm vụ!')
            $('#assignmentStatusModal').modal();
            loadAssignmentInfo_Manager();
        },
        error: function() {
            $('#deleteAssignmentConfirmationModal').modal('hide');
            $('#assignmentStatusModalCancelButton').show();
            $('#assignmentStatusModalConfirmButton').hide();
            $('#assignmentStatusModalTitle').html('Không thể xóa nhiệm vụ!')
            $('#assignmentStatusModal').modal();
        }
    });
}


//=================REPORT FUNCTIONS=========================
//Retrive report data function for manager
function loadReportInfo_Manager() {
    $.ajax({
        url: 'http://localhost:1337/reports',
        type: 'GET',
        success: function(result) {
            str = '';
            $.each(result, function(i, items) {
                str += '<tr>';
                str += '<td>' + items.report_title + '</td>';
                str += '<td>' + items.staff.staff_name + '</td>';
                str += '<td>' + items.project.project_name + '</td>';
                str += '<td>' + items.report_date + '</td>';
                str += '<td class="dropdownMod">' + '<div class="dropdown">\
                                    <a class="btn btn-link font-24 p-0 line-height-1 no-arrow dropdown-toggle" href="#" role="button" data-toggle="dropdown">\
                                        <i class="dw dw-more"></i>\
                                    </a>\
                                    <div class="dropdown-menu dropdown-menu-right dropdown-menu-icon-list">\
                                        <a id="dataV_'+ items.id + '"' + ' class="dropdown-item edit-modal" href="#reportViewModal" data-toggle="modal" role="button"><i class="dw dw-eye"></i> Xem báo cáo</a>\
                                    </div>\
                                </div>'+ '</td>';
                str += '</tr>';
            });
            $('#reportListManager').html(str);
            
            var reportViewId = '';
            for (let i in result) {
                //Load detail specified report
                $('#reportListManager').on('click', '.edit-modal', function () {
                    var elementId = $(this).attr('id');
                    var getRealId = elementId.substr(6);
                    reportViewId = getRealId;
                    if(reportViewId == result[i].id ) {
                        // console.log(result[i].id);
                        $('#reportViewTitle').html(result[i].report_title);
                        var reportContent = result[i].report_content;
                        var fixedReportContent = reportContent.replace(/\n/i, '<br>');
                        $('#reportViewDescription').html(fixedReportContent);
                        $('#reportViewStaff').html(result[i].staff.staff_name);
                        $('#reportViewDate').html(result[i].report_date);
                        $('#reportViewProject').html(result[i].project.project_name);
                    }
                });
            }
        },
        error: function() {
            console.log('Load data failed!');
        }
    });
}

//Retrive report data function for employee
function loadReportInfo_Employee() {
    $.ajax({
        url: 'http://localhost:1337/staffs/' + localStorage.staff_id,
        type: 'GET',
        success: function(result) {
            str = '';
            var staffReportArray = result.reports;
            if(staffReportArray == 0) {
                str += '<tr>';
                str += '<td class="text-center" colspan="3">Bạn hiện không có báo cáo nào!</td>'
                str += '</tr>';
            }else {
                for(let i in staffReportArray) {
                    // console.log(staffReportArray[i].id);
                    str += '<tr>';
                    str += '<td>'+ staffReportArray[i].report_title + '</td>';
                    str += '<td>'+ staffReportArray[i].report_project + '</td>';
                    str += '<td>'+ staffReportArray[i].report_date + '</td>';
                    str += '<td class="dropdownMod">' + '<div class="dropdown">\
                                    <a class="btn btn-link font-24 p-0 line-height-1 no-arrow dropdown-toggle" href="#" role="button" data-toggle="dropdown">\
                                        <i class="dw dw-more"></i>\
                                    </a>\
                                    <div class="dropdown-menu dropdown-menu-right dropdown-menu-icon-list">\
                                        <a id="dataE_'+ staffReportArray[i].id + '"' + ' class="dropdown-item edit-modal" href="#editReportModal" data-toggle="modal" role="button"><i class="dw dw-edit2"></i> Chỉnh sửa</a>\
                                        <a id="dataR_'+ staffReportArray[i].id + '"' + ' class="dropdown-item delete-modal" href="#deleteReportConfirmationModal" data-toggle="modal"><i class="dw dw-delete-3"></i> Xóa</a>\
                                    </div>\
                                </div>'+ '</td>';
                    str += '</tr>';
                }
            }
            $('#reportListEmployee').html(str);
        },
        error: function() {
            console.log('Load data failed!');
        }
    });
}

//Sent new report infomation function
function sentNewReportInfo() {
    //Collect report information form html input
    var report_title = $('#reportTitleAdd').val();
    var report_content = $('#reportDescriptionAdd').val();
    var report_project = $("#reportProjectListAdd option:selected").text();
    var specified_project = $('#reportProjectListAdd').val();
    var specified_staff = localStorage.staff_id;
    //Collect report date
    var report_date = new Date();
    var report_dateString = report_date.toISOString();
    var check_report_dateString = moment(report_dateString);
    var finalReportDate = check_report_dateString.utc().format('YYYY-MM-DD');

    $.ajax({
        url: 'http://localhost:1337/reports',
        type: 'POST',
        data: {
            "report_title" : report_title,
            "report_content" : report_content,
            "report_date": finalReportDate,
            "staff": {
                "id": specified_staff
            },
            "project": {
                "id": specified_project
            },
            "report_project": report_project
        },
        success: function() {
            $('#addReportModal').modal('hide');
            $('#reportStatusModalConfirmButton').show();
            $('#reportStatusModalCancelButton').hide();
            $('#reportStatusModalTitle').html('Đã thêm báo cáo mới!')
            $('#reportStatusModal').modal();
            loadReportInfo_Employee();
        },
        error: function() {
            $('#reportStatusModalConfirmButton').hide();
            $('#reportStatusModalCancelButton').show();
            $('#reportStatusModalTitle').html('Không thể báo cáo mới!')
            $('#reportStatusModal').modal();
        }
    });
}

//Sent edited report infomation function
function sentEditedReportInfo(specifiedReportId) {
    //Collect value from edit report modal
    var report_title = $('#reportTitleEdit').val();
    var report_content = $("#reportDescriptionEdit").val();
    var report_project = $('#reportProjectListEdit option:selected').text();
    var specified_project = $('#reportProjectListEdit').val();

    //Sent edited report infomation back to server
    $.ajax({
        url: 'http://localhost:1337/reports/' + specifiedReportId,
        type: 'PUT',
        data: {
            "report_title": report_title,
            "report_content": report_content,
            "report_project": report_project,
            "project": {
                "id": specified_project
            }
        },
        success: function() {
            $('#editReportModal').modal('hide');
            $('#reportStatusModalConfirmButton').show();
            $('#reportStatusModalCancelButton').hide();
            $('#reportStatusModalTitle').html('Đã sửa thông tin báo cáo ' + report_title + '!');
            $('#reportStatusModal').modal();
            loadReportInfo_Employee();
        },
        error: function() {
            $('#reportStatusModalConfirmButton').hide();
            $('#reportStatusModalCancelButton').show();
            $('#reportStatusModalTitle').html('Không thể sửa thông tin báo cáo ' + report_title + '!');
            $('#reportStatusModal').modal();
        }
    });
}

//delete specified report data function for employee
function deleteSpecifiedReport_Employee(specifiedReportId) {
    $.ajax({
        url: 'http://localhost:1337/reports/' + specifiedReportId,
        type: 'DELETE',
        success: function(result) {
            $('#deleteReportConfirmationModal').modal('hide');
            $('#reportStatusModalConfirmButton').show();
            $('#reportStatusModalCancelButton').hide();
            $('#reportStatusModalTitle').html('Đã xóa báo cáo!')
            $('#reportStatusModal').modal();
            loadReportInfo_Employee();
        },
        error: function() {
            $('#reportStatusModalConfirmButton').hide();
            $('#reportStatusModalCancelButton').show();
            $('#reportStatusModalTitle').html('Không thể xóa báo cáo này!')
            $('#reportStatusModal').modal();
        }
    });
}


//===============DEPARTMENT FUNCTIONS=======================
//Retrieve department data function
function loadDepartmentInfo() {
    $.ajax({
        url: 'http://localhost:1337/departments',
        type: 'GET',
        success: function(result) {
            // console.log(result);
            // console.log(result[0].department_name);
            var str = '';
            $.each(result, function(i, items) {
                str += '<tr>';
                str += '<td>' + items.department_name + '</td>';
                str += '<td>' + items.staffs.length + '</td>';
                str += '<td>' + items.department_description + '</td>';
                str += '<td class="dropdownMod">' + '<div class="dropdown">\
                                    <a class="btn btn-link font-24 p-0 line-height-1 no-arrow dropdown-toggle" href="#" role="button" data-toggle="dropdown">\
                                        <i class="dw dw-more"></i>\
                                    </a>\
                                    <div class="dropdown-menu dropdown-menu-right dropdown-menu-icon-list">\
                                        <a id="dataE_'+ items.id + '"' + ' class="dropdown-item edit-modal" href="#editDepartmentModal" data-toggle="modal" role="button"><i class="dw dw-edit2"></i> Chỉnh sửa</a>\
                                        <a id="dataR_'+ items.id + '"' + ' class="dropdown-item delete-modal" data-toggle="modal"><i class="dw dw-delete-3"></i> Xóa</a>\
                                    </div>\
                                </div>'+'</td>';
                str += '</tr>';
                // console.log(items.department_name);
            });
            $('#departmentList').html(str);

            var departmentId = '';
            $('#departmentList').on('click', '.edit-modal', function() {
                var elementId = $(this).attr('id');
                var getRealId = elementId.substr(6);
                departmentId = getRealId;

                for(let i in result) {
                    if(result[i].id == departmentId) {
                        // console.log(result[i].department_name);
                        // console.log(result[i].department_description);
                        $('#departmentNameEdit').val(result[i].department_name);
                        $('#departmentDescriptionEdit').val(result[i].department_description);
                    }
                }
                $('#saveDepartmentButtonEditModal').click(function() {
                    sentEditedDepartmentInfo(departmentId);
                });
            });
        }
    });
}

//Sent new department infomation back to server
function sentNewDepartmentInfo() {
    //Collect value from input add new department infomation
    var department_name = $('#departmentNameAdd').val();
    var department_description = $('#departmentDescriptionAdd').val();

    //Sent new department info to server
    $.ajax({
        url: 'http://localhost:1337/departments',
        type: 'POST',
        data: {
            "department_name": department_name,
            "department_description": department_description
        },
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        },
        success: function() {
            $('#addDepartmentModal').modal('hide');
            $('#departmentStatusModalTitle').html('Đã thêm '+ department_name + ' vào danh sách phòng ban!');
            $('#departmentStatusModalConfirmButton').show();
            $('#departmentStatusModalCancelButton').hide();
            $('#departmentStatusModal').modal();
            loadDepartmentInfo();
        },
        error: function() {
            $('#departmentStatusModalTitle').html('Không thể thêm '+ department_name + ' vào danh sách phòng ban!');
            $('#departmentStatusModalConfirmButton').hide();
            $('#departmentStatusModalCancelButton').show();
            $('#departmentStatusModal').modal();
        }
    });
}

//Sent edited department 
function sentEditedDepartmentInfo(id) {
    //Collect value from input edit department infomation
    var department_name = $('#departmentNameEdit').val();
    var department_description = $('#departmentDescriptionEdit').val();

    //Sent edited department infomation
    $.ajax({
        url: 'http://localhost:1337/departments/' + id,
        type: 'PUT',
        headers: {
            'Authorization' : 'Bearer ' + localStorage.token
        },
        data: {
            "department_name": department_name,
            "department_desciption": department_description
        },
        success: function() {
            $('#editDepartmentModal').modal('hide');
            $('#departmentStatusModalTitle').html('Đã sửa thông tin '+ department_name + '!');
            $('#departmentStatusModalConfirmButton').show();
            $('#departmentStatusModalCancelButton').hide();
            $('#departmentStatusModal').modal();
            loadDepartmentInfo();
        },
        error: function() {
            $('#departmentStatusModalTitle').html('Không thể sửa thông tin '+ department_name + '!');
            $('#departmentStatusModalConfirmButton').hide();
            $('#departmentStatusModalCancelButton').show();
            $('#departmentStatusModal').modal();
        }
    });

}

//Delete specified department
function deleteSpecifiedDepartment(id) {
    $.ajax({
        url: 'http://localhost:1337/departments/' + id,
        type: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        },
        success: function() {
            $('#departmentStatusModalTitle').html('Đã xóa!');
            $('#departmentStatusModalConfirmButton').show();
            $('#departmentStatusModalCancelButton').hide();
            $('#departmentStatusModal').modal();
            loadDepartmentInfo();
        },
        error: function() {
            $('#departmentStatusModalTitle').html('Không thể xóa!');
            $('#departmentStatusModalConfirmButton').hide();
            $('#departmentStatusModalCancelButton').show();
            $('#departmentStatusModal').modal();
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
            localStorage.setItem('staff_id', result.user.staff.id);
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
    localStorage.removeItem('staff_id');
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
            window.location.replace('index_employees.html');
        });
    }else {
        $('#loginStatusModalConfirmButton').click(function () {
            window.location.replace('index_manager.html');
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