document.addEventListener('DOMContentLoaded', function() {
	var input = document.getElementById('input');
	var inputPreview = document.getElementById('input-image-preview');
	var renderer = new Renderer();
	new Workflow();
	FormatSelector('input-format', (getter) => { renderer.setInputGetter(getter); });
	FormatSelector('output-format', (getter) => { renderer.setOutputGetter(getter); });
	input.addEventListener('change', function(event) {
		unbindChooseFile();
		if (input.value) {
			const fileReader = new FileReader();
			function refreshImagePreview(event) {
				inputPreview.style.backgroundImage = 'url("' + fileReader.result + '")';
				renderer.invalidateImageDataCache();
				renderer.draw();
			}
			fileReader.onload = refreshImagePreview;
			fileReader.readAsDataURL(input.files[0])
		}
	});
	function unbindChooseFile() {
		document.removeEventListener('click', chooseFile);
	}
	function chooseFile(event) {
		unbindChooseFile();
		if (input !== event.target)
			input.click();
	}

	initDownloader();
	document.addEventListener('click', chooseFile);
});