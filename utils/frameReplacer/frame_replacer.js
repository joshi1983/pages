var path = require('path');
var fs = require('fs');
//joining path of directory 
var directoryPath = path.join(__dirname, '.');
//passsing directoryPath and callback function
function getDestinationFile(file) {
	var index = file.lastIndexOf('(');
	file = file.substring(0, index).trim();
	return file + ".png";
}

fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
		if (file.indexOf('(') !== -1 && file.indexOf(')') !== -1 && file.indexOf('cloud_frame_') != -1 && file.indexOf('.png') != -1) {
			var destinationFileName = getDestinationFile(file);
			if(fs.existsSync(destinationFileName)) {
				console.log('delete ' + destinationFileName);
				fs.unlinkSync(destinationFileName);
			}
			// Do whatever you want to do with the file
			console.log('renaming ' + file + ", destination is: " + destinationFileName);
			fs.rename(file, destinationFileName, function(err) {
				if (err !== null) {
					console.log('rename callback hit.  err = ' + err);
				}
			});
		}
    });
});