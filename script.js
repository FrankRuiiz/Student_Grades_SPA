
/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [
    {
        studentName: 'Frank',
        course: 'Math',
        studentGrade: 89
    },
    {
        studentName: 'Max',
        course: 'Science',
        studentGrade: 89
    },
    {
        studentName: 'John',
        course: 'Geology',
        studentGrade: 89
    }
];


/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = ['#studentName', '#course', '#studentGrade'];



    /**
     * addClicked - Event Handler when user clicks the add button
     */
    $('#add').click(function(){
       console.log('Add was clicked');
        addStudent();
        clearAddStudentForm();
    });


    /**
     * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
     */
    $('#cancel').click(function(){
        console.log('Cancel Clicked');
        clearAddStudentForm();
    });

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

    student_array.push(studentObj);
    addStudentToDom(studentObj);
}


/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm() {
    var i;
    for( i=0; i <= inputIds.length; i++ ) {
        $(inputIds[i]).val('');
    }
}




/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */


/**
 * updateData - centralized function to update the average and call student list update
 */



/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList(array) {
    var i;
    for( i=0; i<array.length; i++ ) {
        addStudentToDom(array[i]);
    }
}


/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * //@param studentObj
 */
function addStudentToDom(studentObj) {
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

    student_tr.append(name_td, course_td, grade_td);
    tbody.append(student_tr);
    console.log("tbody", tbody);
}




/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    student_array = [];
    $('.student-list > tbody').empty();
}



/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function() {
    //reset();
    updateStudentList(student_array);
});
