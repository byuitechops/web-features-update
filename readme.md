# Web Features Update
### *Package Name*: web-features-update
### *Child Type*: Post-import
### *Platform*: Online
### *Required*: Required

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [Here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose
This child module wraps all HTML content in a <div class="byui"> tag that enables BYU-I web features. Without this div they wil not work.

## How to Install
```
npm install web-features-update
```

## Run Requirements
This child module requires the following fields in the course.info object:
* `fileName`
* `courseCode`
* `canvasOU` 

## Options
None

## Outputs
None

## Process
1. Get all pages
2. Update each page's HTML
2. Repeat for quizzes, discussions, and assignments

## Log Categories
- Web Features Implemented

## Requirements
Web features will work automatically as long as the HTML is wrapped in the 'byui' class. It is possible that we can get them working without this wrapper, but until then we need this child module to add the wrapper.