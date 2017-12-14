/*eslint-env node, es6*/

/* Makes changes to the web features in Canvas */

const canvas = require('canvas-wrapper'),
    async = require('async'),
    cheerio = require('cheerio');

module.exports = (course, stepCallback) => {
    var $;
    course.addModuleReport('web-features-update');

    //1. makeChanges to the specified html
    function divWrap(callback) {
        var htmlBody = document.getElementById('main'),
            newDiv = document.createElement('div'),
            wrapBody = htmlBody.parentNode.appendChild(newDiv),
            wrap = wrapper.appendChild(htmlBody);
        newDiv.setAttribute('class', 'wrapper-div');
        callback(wrapBody, wrap);
    }
    var changeFunctions = [divWrap];

    function makeChanges(callback) {
        async.waterfall(changeFunctions, function (err, results) {
            if (err) {
                console.log(err)
                callback(err);
                return;
            }
            course.success('web-features-update', 'successfully')
            callback(null, results)
        })
    }
    //2. Complete these changes on all the specified content
    function getPages(callbackPages) {
        var courseId = course.info.canvasOU,
            pagesApi = '/ap1/v1/courses/' + courseId + 'pages',
            changesMade = { /*some object here*/ };
        canvas.get(contentUrl, function (err, pages) {
            if (err) {
                console.log('getContent Error', err)
                callbackPages(err);
                return;
            }
            makeChanges(callbackPages);
            canvas.put(pagesApi, changesMade, function (err, body) {
                if (err) {
                    console.log(err)
                    callback(err);
                    return;
                }
            });
        });
    }

    //3. Call everything to do all of it.
    var everything = [pages, quizzes, files, assignments]
    async.waterfall(everything, function (err, result) {
        if (err) {
            course.throwErr('web-features-update', err)
            callback(err);
            return;
        } else {
            course.success('web-features-update', 'process complete!')
        }
    })
    stepCallback(null, course);
};
