/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = []; // The global student_array holds all student objects

/**
 * Represents the firebase object - a reference to the database
 */
var firebaseRef = new Firebase("https://jquerysgt.firebaseio.com/students");

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = ['#studentName', '#course', '#studentGrade']; // this array is used inside clearAddStudentForm to clear out the input field when a student is added or the cancel button is clicked


/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent() {
    var studentObj = {};

    studentObj.studentName = $('#studentName').val();
    studentObj.course = $('#course').val();
    studentObj.studentGrade = $('#studentGrade').val();

    student_array.push(studentObj); // Adds new student to student array

    firebaseRef.push({ // pushes new student to server
        studentName: studentObj.studentName,
        course: studentObj.course,
        studentGrade: studentObj.studentGrade
    });

    // firebaseRef.on("child_added", function(studentSnapshot) {  //TODO: this doesnt seem to do anything
    //     // console.log(studentSnapshot);
    //     // updateData();
    // }, function (errorObject) {
    //     console.log("The read failed: " + errorObject.code);
    // });

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
    var gradesTotal = 0;
    var average = null;

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
    $('.student-list > tbody').empty();  //Needs to clear out the current list otherwise we will get duplicates

    var i;
    for (i = 0; i < student_array.length; i++) {
        addStudentToDom(student_array[i], i);
    }
}


/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * //@param studentObj
 */
function addStudentToDom(studentObj, index) {

    var tbody = $('.student-list > tbody');

    var student_tr = $('<tr>');
    var name_td = $('<td>', {
        html: studentObj.studentName
    });
    var course_td = $('<td>', {
        html: studentObj.course
    });
    var grade_td = $('<td>', {
        html: studentObj.studentGrade
    });
    var delete_td = $('<td>', {
        class: 'text-center'
    });
    var delete_btn = $('<button>', {
        class: 'btn btn-sm btn-danger',
        text: 'Delete',
        id: studentObj.key,
        'data-index': index,
        click: function() {
            console.log(studentObj.studentName + " deleted");
            var studentFirebaseRef = firebaseRef.child(studentObj.key);

            firebaseRef.on('child_removed', function(snapshot) {
                console.log("Delete Snapshot", snapshot);
                student_array.splice(index, 1); // removes student from the student array using the index it was assigned as a reference
                student_tr.remove(); // removes the student from the dom
                updateData();
            });
            studentFirebaseRef.remove();
        }
    });

    delete_td.append(delete_btn);
    student_tr.append(name_td, course_td, grade_td, delete_td);
    tbody.append(student_tr);
}


/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    student_array = [];
    $('.student-list > tbody').empty();
}


function addStudentsFromServer(data) {

    reset(); // clears the student array and tboy

    for (var student in data) {
       // console.log(student);
        var studentObj = {};
        if (data.hasOwnProperty(student)) {
            studentObj.key = student;
            studentObj.studentName = data[student].studentName;
            studentObj.course = data[student].course;
            studentObj.studentGrade = data[student].studentGrade;

            console.log(studentObj);

            student_array.push(studentObj);
        }
    }

    updateData();
}


/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function () {
    reset();
    updateStudentList();
    updateData();

    /**
     * add - Event Handler when user clicks the add button
     */
    $('#add').click(function () {
        addStudent();  // adds student from the input form to the student_array
        updateData();  // updates the average and also calls updateStudentList which updates the DOM since add student added a new object to the student_array
        clearAddStudentForm(); // just clears out the input values from the form
    });


    /**
     * cancel - Event Handler when user clicks the cancel button, should clear out student form
     */
    $('#cancel').click(function () {
        clearAddStudentForm();
    });

    /**
     * get data - Event Handler when user clicks the get data button, it will pull student objects from the server
     */
    $('#get-data').click(function(){
        firebaseRef.on("value", function(snapshot, prevChildKey) {
            var data = snapshot.val();
            addStudentsFromServer(data);  //function to add each student object to student_array

        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    });
});
