/*eslint-env node, es6*/

/* Makes changes to the web features in Canvas */

const canvas = require('canvas-wrapper'),
    async = require('async');

module.exports = (course, stepCallback) => {
    course.addModuleReport('web-features-update');

    //1. makeChanges to the specified files
    function divWrap(htmlBody) {}
    var changeFunctions = [divWrap];

    function makeChanges(callback) {
        //I want to specify this callback... how do I do that?
        async.waterfall(changeFunctions, function (err, results) {
            course.success('web-features-update', 'successfully')
            callback(null)
        })
    }
    //2. Complete these changes on all the specified content
    function getPages(callbackPages) {
        var pagesApi = '',
            changesMade = { /*some object here*/ };
        canvas.get(contentUrl, function (err, pages) {
            if (err) {
                console.log('getContent Error', err)
                callbackPages(err);
                return;
            }
            makeChanges(callbackPages);
            canvas.put(pagesApi, changesMade, function (err, body) {
                /*err handling here*/
            });
        });
    }

    //3. Call everything to do all of it.
    var everything = [pages, quizzes, files, assignments];

    function doEverything(everything, function (err, result) {
        if (err) {
            course.throwErr('web-features-update', err)
        }
        course.success('web-features-update', 'process complete!')
    })
    stepCallback(null, course);
};
