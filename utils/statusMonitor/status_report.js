var path = require('path');
var fs = require('fs');
const { exec } = require('child_process');
//joining path of directory 
var directoryPath = 'C://Users/josh.greig/Downloads';

function playSound(mp3) {
	exec('start ' + mp3);
}

function allGood() {
	console.log('All is good.');
	playSound('./yay.mp3');
}

function allBad() {
	console.log('Something is not working.');
	playSound('./railroad.mp3');
}

fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
	var maxNum = -1;
	var maxFile;
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
		if (file.endsWith(".png") && file.indexOf("cloud_frame_") !== -1) {
			var number = file.substring(file.indexOf('cloud_frame_') + 'cloud_frame_'.length);
			number = number.match(/\d+/)[0];
			number = parseInt(number);
			maxNum = Math.max(maxNum, number);
			maxFile = file;
		}
    });
	fs.stat(path.join(directoryPath, maxFile), function(err, stats) {
		var ctime = stats.ctime.getTime();
		var d = new Date().getTime();
		if (d - ctime > 30 * 60 * 1000) {
			console.log('File created too long ago. ' + (d - ctime));
			allBad();
		}
		else {
			allGood();
		}
		allGood();
	});
	console.log(maxNum, maxFile);
});