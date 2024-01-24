const url = 'dist/scriptExamples.zip';
let examplesData = new Map();
let promise = fetch('dist/scriptExamples.zip').
	then(response => response.blob()).
	then(function(blob) {
		var zip = new window.JSZip();
		const promises = [];
		return zip.loadAsync(blob).then(function(contents) {
			for (const key in contents.files) {
				const file = zip.file(key);
				promises.push(file.async('text').then(function(textContent) {
					examplesData.set(key, textContent);
				}));
			}
		}).then(function() {
			return Promise.all(promises);
		});
	}).catch(function(e) {
		console.error(`catch: ${e}`);
	});

export class ZippedExamples {
	static asyncInit() {
		return promise;
	}

	static getContentForFilename(filename) {
		return examplesData.get(filename);
	}
};