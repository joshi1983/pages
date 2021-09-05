/*
This is used for the file list in a test at:
tests/parsing/js-parsing/testVariousJavaScriptFiles.js.
*/
var fs = require('fs');
var path = require('path');

var walk = function(directoryName) {
  fs.readdir(directoryName, function(e, files) {
    if (e) {
      console.log('Error: ', e);
      return;
    }
    files.forEach(function(file) {
      var fullPath = path.join(directoryName,file);
      fs.stat(fullPath, function(e, f) {
        if (e) {
          console.log('Error: ', e);
          return;
        }
        if (f.isDirectory()) {
          walk(fullPath);
        } else {
			if (fullPath.endsWith('.js'))
				console.log(`"${fullPath.substring(3).replace(/\\/g, '/')}",`);
        }
      });
    });
  });
};

walk('../modules');