// This is used by gulpfile.js.
// You can run the task with:
// gulp js-filenames

/*
This is used for the file list in a test at:
tests/parsing/js-parsing/testVariousJavaScriptFiles.js.
*/
var fs = require('fs');
var path = require('path');

function printJSFilenames() {
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
					result.push(fullPath.replace(/\\/g, '/'));
				}
			}
		  });
		});
	  });
	};

	walk('./modules');
	walk('./prototypes');
	walk('./tests');

	return new Promise(function(resolve, reject) {
		function recheckStatus() {
			if (counter === 0) {
				result.sort((a, b) => { return a.toLowerCase().localeCompare(b.toLowerCase()); });
				const data = result.join('\n');
				fs.writeFile('./tests/data/js-filenames.txt', data, (err) => {
					// In case of a error throw err.
					reject(err);
				});
				resolve();
			}
			else {
				console.log('counter = ' + counter);
				setTimeout(recheckStatus, 1000);
			}
		}
		setTimeout(recheckStatus, 1000);
	});
}

module.exports = printJSFilenames;