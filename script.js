/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];

/**
 * Represents the firebase object - a reference to the database
 */
var firebaseRef = new Firebase("https://jquerysgt.firebaseio.com/students");


/**
 * inputIds - Used inside clearAddStudentForm() for clearing out input fields
 * @type {string[]}
 */
var inputIds = ['#studentName', '#course', '#studentGrade'];


/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @return undefined
 */
function addStudent() {
    var studentObj = {};
    studentObj.studentName = $('#studentName').val();
    studentObj.course = $('#course').val();
    studentObj.studentGrade = $('#studentGrade').val();
    student_array.push(studentObj); // Adds new student to student array
    firebasePush(studentObj);
    clearAddStudentForm();
}


/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm() {
    var i;
    for (i = 0; i <= inputIds.length; i++) {
        $(inputIds[i]).val('');
    }
}


/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage() {
    var gradesTotal = 0, average = null;

    for (var i = 0; i < student_array.length; i++) {
        gradesTotal += parseInt(student_array[i].studentGrade);
    }

    average = Math.round(gradesTotal / student_array.length);
    return average;
}


/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData() {
    $('.avgGrade').html(calculateAverage());
    updateStudentList();
}


/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList() {
    $('.student-list > tbody').empty();  // clears out current items in table, otherwise they will continue to stack

    var i;
    for (i = 0; i < student_array.length; i++) {
        addStudentToDom(student_array[i]);
    }
}




/** DOM creation **/
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * //@param studentObj
 */
function addStudentToDom(studentObj) {
    var studentFirebaseRef = firebaseRef.child(studentObj.key);
    // Each student added will get appended to .student-list > tbody.  The fist <tr> will display saved student information, the second <tr> will be for editing purposes
    var tbody = $('.student-list > tbody');
    // Saved Student info(studentName, course, studentGrade, edit and delete button)
    var student_tr = $('<tr>');
    // creates element for studentName
    var name_td = $('<td>', {
        html: studentObj.studentName
    });
    // creates element for course
    var course_td = $('<td>', {
        html: studentObj.course
    });
    //creates element for studentGrade
    var grade_td = $('<td>', {
        html: studentObj.studentGrade
    });
    // creates element for delete container (<td>)
    var operations = $('<td>', {
        class: 'text-center'
    });
    // creates element for actual delete button and adds delete functionality for DOM and Database
    var delete_btn = $('<button>', {
        class: 'btn btn-sm btn-danger',
        html: '<i class="fa fa-trash-o fa-lg" aria-hidden="true"></i>',
        id: studentObj.key,
        click: function (e) {
            e.preventDefault();
            firebaseDelete(studentFirebaseRef);
        }
    });
    var edit_btn = $('<button>', {
        class: 'btn btn-sm btn-warning',
        html: '<i class="fa fa-pencil fa-lg" aria-hidden="true"></i>',
        click: function (e) {
            e.preventDefault();
            $(this).attr('disabled', 'disabled').closest('tr').next().toggleClass('row-hide');
        }
    });
    // Will contain all input fields for editing a student, including submit and cancel button
    var studentEdit_tr = $('<tr>', {
        class: 'row-hide editInputs'
    });
    // editStudentName
    var editName_td = $('<td><input type="text" class="form-control input-sm editStudentName" value="' + studentObj.studentName + '"></td>');
    // editCourse
    var editCourse_td = $('<td><input type="text" class="form-control input-sm editCourse" value="' + studentObj.course + '"></td>');
    // editGrade
    var editGrade_td = $('<td><input type="text" class="form-control input-sm editStudentGrade" value="' + studentObj.studentGrade + '"></td>');
    var editOps_td = $('<td>', {  // edit button container
        class: 'text-center'
    });
    var editSubmit_btn = $('<button>', { // submit edit button
        id: 'editSubmit',
        class: 'btn btn-xs btn-default',
        html: '&#x2714;',
        click: function (e) {
            e.preventDefault();
            var editedStudentName = studentEdit_tr.find($('.editStudentName')).val();
            var editedCourse = studentEdit_tr.find($('.editCourse')).val();
            var editedStudentGrade = studentEdit_tr.find($('.editStudentGrade')).val();
            firebaseUpdate(studentFirebaseRef, editedStudentName, editedCourse, editedStudentGrade);
        }
    });
    var editCancel_btn = $('<button>', {  // cancel edit button
        class: 'btn btn-xs btn-default',
        html: '&#x274C;',
        click: function (e) {
            e.preventDefault();
            $(this).closest('tr').toggleClass('row-hide').prev('tr').find('button').removeAttr('disabled');
        }
    });

    // Appending student <tr>'s to the DOM
    operations.append(delete_btn, edit_btn);
    student_tr.append(name_td, course_td, grade_td, operations);

    editOps_td.append(editSubmit_btn, editCancel_btn);
    studentEdit_tr.append(editName_td, editCourse_td, editGrade_td, editOps_td);

    tbody.append(student_tr, studentEdit_tr);
}


/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    student_array = [];
    $('.student-list > tbody').empty();
}


/**
 * addStudentsFromServer(data) - iterates through response data and pushes student object to student_array
 * @param data
 */
function addStudentsFromServer(data) {

    reset(); // clears the student array and tboy

    for (var student in data) {
        var studentObj = {};
        if (data.hasOwnProperty(student)) {
            studentObj.key = student;
            studentObj.studentName = data[student].studentName;
            studentObj.course = data[student].course;
            studentObj.studentGrade = data[student].studentGrade;
            student_array.push(studentObj);
        }
    }

    updateData();
}

function sortStudentName($elem) {
    if($elem.hasClass('sorted')) {
        student_array.reverse();
    }
    else {
        $elem.addClass('sorted');
        $elem.siblings().removeClass('sorted');
        student_array.sort(function(a, b) {
            if( a.studentName < b.studentName ) {
                return -1;
            }
            else {
                return a.studentName > b.studentName ? 1 : 0;
            }
        });
    }
    updateStudentList();
}

function sortCourse($elem) {
    if($elem.hasClass('sorted')) {
        student_array.reverse();
    }
    else {
        $elem.addClass('sorted');
        $elem.siblings().removeClass('sorted');
        student_array.sort(function(a, b) {
            if( a.course < b.course ) {
                return -1;
            }
            else {
                return a.course > b.course ? 1 : 0;
            }
        });
    }
    updateStudentList();
}

function sortGrade($elem) {
    if($elem.hasClass('sorted')) {
        student_array.reverse();
    }
    else {
        $elem.addClass('sorted');
        $elem.siblings().removeClass('sorted');
        student_array.sort(function(a, b) {
            return a.studentGrade - b.studentGrade;
        });
    }
    updateStudentList();
}


/** Firebase CRUD Operations **/

/** callServer() - Executes on page load, will call addStudentFromServer() once response data is received
 * 
 */
function firebaseRead($load) {
    firebaseRef.on("value", function (snapshot) {
        $load.hide();
        var data = snapshot.val();
        addStudentsFromServer(data);  //function to add each student object to student_array

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}


/**
 * firebasePush(studentObj) - Takes new created student object and and adds it to the database
 * @param studentObj
 */
function firebasePush(studentObj) {
    firebaseRef.push({ // pushes new student to server
        studentName: studentObj.studentName,
        course: studentObj.course,
        studentGrade: studentObj.studentGrade
    });
    firebaseRef.on("child_added", function(studentSnapshot) {
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);  // logs an error if read fails
    });
}


/**
 * firebaseDelete(studentFirebaseRef) - Takes student reference and removes that object from the database
 * @param studentFirebaseRef
 */
function firebaseDelete(studentFirebaseRef) {
    var onComplete = function(error) {
        if(error) {
            console.log('Synchronization failed'); // logs an error if sync fails
        }
        else {
            console.log('Synchronization succeeded');
        }
    };
    studentFirebaseRef.remove(onComplete);  // removes student onComplete
}


/**
 * firebaseUpdate - takes firebase ref and content from edit input fields; updates the database
 * @param studentFirebaseRef
 * @param editedStudentName
 * @param editedCourse
 * @param editedStudentGrade
 */
function firebaseUpdate(studentFirebaseRef, editedStudentName, editedCourse, editedStudentGrade ) {
    var onComplete = function(error) {
        if(error) {
            console.log('Synchronization failed');
        }
        else {
            console.log('Synchronization succeeded');
        }
    };
    studentFirebaseRef.update({
        studentName: editedStudentName,
        course: editedCourse,
        studentGrade: editedStudentGrade
    }, onComplete);
}




/**
 * Listen for the document to load
 */
$(document).ready(function () {
    /**
     * add - Event Handler when user clicks the add button
     */
    $('#add').click(function () {
        addStudent();  // adds student from the input form to the student_array & firebase
    });


    /**
     * cancel - Event Handler when user clicks the cancel button
     */
    $('#cancel').click(function () {   // will clear out the form
        clearAddStudentForm();
    });


    $('#sortName').click(function() {
       sortStudentName($(this));
    });

    $('#sortCourse').click(function() {
       sortCourse($(this));
    });

    $('#sortGrade').click(function() {
       sortGrade($(this));
    });

    var $load  = $('<div class="loading"><i class="fa fa-cog fa-spin fa-5x fa-fw"></i><span class="sr-only">Loading...</span></div>').appendTo($(".student-list-container"));

    firebaseRead($load);  // initial call to the server

});