
function init() {
	const list = document.getElementById('file-list');
	fetch('./example.zip').then(response => response.blob())
	.then(function(blob) {
		var zip = new JSZip();
		zip.loadAsync(blob).then(function(contents) {
			Object.keys(contents.files).forEach(function(filename) {
				const li = document.createElement('li');
				li.innerText = filename;
				list.appendChild(li);
			});
			// show the svg content from Utah.svg.
			const svg = zip.file('Utah.svg');
			console.log(svg);
			svg.async('text').then(console.log);
		});
	})
	.catch(function(e) {
		console.error(`catch: ${e}`);
	});
}

if (document.status === 'ready')
	init();
else
	document.addEventListener('DOMContentLoaded', init);