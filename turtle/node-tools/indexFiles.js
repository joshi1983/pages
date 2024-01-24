var fs = require('fs');

function indexFiles(directoryName, extension) {
	const outFilename = 'index.json';

	fs.readdir(directoryName, function(e, files) {
		if (e) {
		  console.log('Error: ', e);
		  return;
		}
		const list = [];
		files.forEach(function(file) {
			if (file.endsWith('.' + extension))
				list.push(file);
		});
		list.sort();
		const filename = `${directoryName}/${outFilename}`;
		fs.writeFile(filename, JSON.stringify(list), function(err) {
			if(err) {
				return console.log(err);
			}
			console.log(`The file ${filename} was saved!`);
		});
	});
}

module.exports = indexFiles;