/*eslint-env node, es6*/

/* Adds a <div class="byui"> around any HTML content in the pages, quizzes, discussins, and assignments */

const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, stepCallback) => {

    /* Give us the class for the course code */
    var courseCode = course.info.fileName.split(' ');
    courseCode = courseCode[0] + courseCode[1];
    courseCode = courseCode.toLowerCase().replace(/\s+/g, '');
    courseCode = courseCode.replace(/:/g, '');

    /* Slaps our div around the html */
    function wrapHTML(html) {
        return `<div class="byui ${courseCode}">${html}</div>`;
    }

    /* *** PAGES *** */
    function getPages(callback) {
        canvas.get(`/api/v1/courses/${course.info.canvasOU}/pages`, (err, pages) => {
            if (err) callback(err, pages);
            else callback(null, pages);
        });
    }

    function setPages(pages, callback) {

        /* Push the changed HTML to canvas */
        function setPage(page, eachCallback) {
            /* Get the page so we can get its body (which isn't included when listing all pages) */
            canvas.get(`/api/v1/courses/${course.info.canvasOU}/pages/${page.url}`, (err, pageDetails) => {
                if (err) course.error(err);
                else {
                    /* Set the page with the new HTML */
                    canvas.put(`/api/v1/courses/${course.info.canvasOU}/pages/${page.url}`, {
                            'wiki_page[body]': wrapHTML(pageDetails[0].body) // Wrap the HTML before sending it
                        },
                        (err2, changedPage) => {
                            if (err2) eachCallback(err2);
                            else {
                                course.log('Web Features Implemented', {
                                    'Name': changedPage.title,
                                    'ID': changedPage.id,
                                    'Type': 'Page'
                                });
                                eachCallback(null);
                            }
                        });
                }
            });
        }

        /* For each page ... */
        asyncLib.each(pages, setPage, err => {
            if (err) callback(err);
            else callback(null);
        });
    }

    /* *** QUIZZES *** */
    function getQuizzes(callback) {
        canvas.get(`/api/v1/courses/${course.info.canvasOU}/quizzes`, (err, quizzes) => {
            if (err) callback(err, quizzes);
            else callback(null, quizzes);
        });
    }

    function setQuizzes(quizzes, callback) {

        /* Push the changed HTML to canvas */
        function setQuiz(quiz, eachCallback) {
            canvas.put(`/api/v1/courses/${course.info.canvasOU}/quizzes/${quiz.id}`, {
                    'quiz[description]': wrapHTML(quiz.description) // Wrap the HTML before sending it
                },
                (err, changedQuiz) => {
                    if (err) eachCallback(err);
                    else {
                        course.log('Web Features Implemented', {
                            'Name': quiz.title,
                            'ID': quiz.id,
                            'Type': 'Quiz'
                        });
                        eachCallback(null);
                    }
                });
        }

        /* For each quiz ... */
        asyncLib.each(quizzes, setQuiz, err => {
            if (err) callback(err);
            else callback(null);
        });
    }

    /* *** DISCUSSIONS *** */
    function getDiscussions(callback) {
        canvas.get(`/api/v1/courses/${course.info.canvasOU}/discussion_topics`, (err, discussions) => {
            if (err) callback(err, discussions);
            else callback(null, discussions);
        });
    }

    function setDiscussions(discussions, callback) {
        /* Push the changed HTML to canvas */
        function setDiscussion(discussion, eachCallback) {
            canvas.put(`/api/v1/courses/${course.info.canvasOU}/discussion_topics/${discussion.id}`, {
                    message: wrapHTML(discussion.message)
                },
                (err, changedDiscussion) => {
                    if (err) eachCallback(err);
                    else {
                        course.log('Web Features Implemented', {
                            'Name': discussion.title,
                            'ID': discussion.id,
                            'Type': 'Discussion'
                        });
                        eachCallback(null);
                    }
                });
        }

        /* For each discussion topic ... */
        asyncLib.each(discussions, setDiscussion, err => {
            if (err) callback(err);
            else callback(null);
        });
    }

    /* *** ASSIGNMENTS *** */
    function getAssignments(callback) {
        canvas.get(`/api/v1/courses/${course.info.canvasOU}/assignments`, (err, assignments) => {
            if (err) callback(err, assignments);
            else callback(null, assignments);
        });
    }

    function setAssignments(assignments, callback) {
        /* Push the changed HTML to canvas */
        function setAssignment(assignment, eachCallback) {
            /* If it is attached to a quiz or discussion board, we already did it */
            if (assignment.quiz_id || assignment.discussion_topic) {
                eachCallback(null);
            } else {
                canvas.put(`/api/v1/courses/${course.info.canvasOU}/assignments/${assignment.id}`, {
                        'assignment[description]': wrapHTML(assignment.description)
                    },
                    (err, changedAssignment) => {
                        if (err) eachCallback(err);
                        else {
                            course.log('Web Features Implemented', {
                                'Name': assignment.title,
                                'ID': assignment.id,
                                'Type': 'Assignment'
                            });
                            eachCallback(null);
                        }
                    });
            }
        }

        /* For each discussion topic ... */
        asyncLib.each(assignments, setAssignment, err => {
            if (err) callback(err);
            else callback(null);
        });
    }

    /* Our list of functions to run */
    var functions = [
        getPages,
        setPages,
        getQuizzes,
        setQuizzes,
        getDiscussions,
        setDiscussions,
        getAssignments,
        setAssignments
    ];

    asyncLib.waterfall(functions, function (err, result) {
        if (err) {
            course.error(err);
            stepCallback(null, course);
        } else {
            course.message('All HTML updated with the <div class="byui [coursecode]"> tag.');
            stepCallback(null, course);
        }
    })
};