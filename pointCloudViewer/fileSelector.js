function initFileSelector(webglUtils) {
	var fileSelector = document.getElementById('cloud-file');
	var format = new PointCloudFileFormats();
	fileSelector.setAttribute('accept', format.accept);
	fileSelector.addEventListener('input', function() {
		var file = fileSelector.files[0];
		if (file) {
			var filename = file.name;
			format.loadFromFile(file, {'r': 1, 'g': 1, 'b': 1}).then(function(result) {
				webglUtils.setPoints(result);
			});
		}
	});
}