/*
This is used for the file list in a test at:
tests/parsing/js-parsing/testVariousJavaScriptFiles.js.
*/
var fs = require('fs');
var path = require('path');
const result = [];
let counter = 0;

var walk = function(directoryName) {
	counter++;
  fs.readdir(directoryName, function(e, files) {
	  counter--;
    if (e) {
      console.log('Error: ', e);
      return;
    }
    files.forEach(function(file) {
      var fullPath = path.join(directoryName,file);
	  counter++;
      fs.stat(fullPath, function(e, f) {
		  counter--;
        if (e) {
          console.log('Error: ', e);
          return;
        }
        if (f.isDirectory()) {
          walk(fullPath);
        } else {
			if (fullPath.endsWith('.js')) {
				result.push(`"${fullPath.substring(3).replace(/\\/g, '/')}",`);
			}
        }
      });
    });
  });
};

walk('../modules');
function recheckStatus() {
	if (counter === 0) {
		console.log('result.length=' + result.length);
		result.sort((a, b) => { return a.toLowerCase().localeCompare(b.toLowerCase()); });
		console.log(result.join('\n'));	
	}
	else {
		console.log('counter = ' + counter);
		setTimeout(recheckStatus, 1000);
	}
}
setTimeout(recheckStatus, 2000);