function isImage(dataUrl) {
	dataUrl = getMime(dataUrl);
	if (dataUrl.startsWith('data:image/'))
		return true;
	return false;
}

function isText(dataUrl) {
	dataUrl = getMime(dataUrl);
	if (dataUrl.startsWith('data:text/'))
		return true;
	return false;
}

function isTextFileExtension(filename) {
	const exts = ['txt', 'css', 'js', 'html', 'htm'];
	filename = filename.toLowerCase();
	for (const ext of exts) {
		if (filename.endsWith('.' + ext))
			return true;
	}
	return false;
}

function getMime(dataUrl) {
	const index = dataUrl.indexOf(';');
	if (index === -1)
		return '';
	else
		return dataUrl.substring(0, index);
}

// copied from an answer at https://stackoverflow.com/questions/490908/paste-an-image-from-clipboard-using-javascript
// window.addEventListener('paste', ... or
document.addEventListener('paste', function(event){
	var items = (event.clipboardData || event.originalEvent.clipboardData).items;
	const image = document.getElementById('pasted-image');
	const messageElement = document.getElementById('message');
	const pastedTextElement = document.getElementById('pasted-text');
	const filenameElement = document.getElementById('filename');
	messageElement.innerText = '';
	pastedTextElement.value = '';
	filenameElement.innerText = '';
	for (let item of items) {
		if (item.kind === 'string') {
			item.getAsString(function(result) {
				pastedTextElement.value = result;
			});
		}
		else if (item.kind === 'file') {
			var blob = item.getAsFile();
			filenameElement.innerText = blob.name;
			var reader = new FileReader();
			reader.onload = function(event){
				const dataUrl = event.target.result;
				if (isImage(dataUrl)) {
					image.setAttribute('src', dataUrl);
				}
				else if (isText(dataUrl)) {
					let data = dataUrl.substring(getMime(dataUrl).length + 1);
					const commaIndex = data.indexOf(',');
					if (commaIndex !== -1)
						data = data.substring(commaIndex + 1);
					pastedTextElement.value = atob(data);
				}
				else {
					messageElement.innerText = `Unrecognized content type ${getMime(dataUrl)} for name ${blob.name}`;
				}
			}; // data url!
			reader.readAsDataURL(blob);
		}
		else {
			messageElement.innerText = `Unrecognized item kind ${item.kind}`;
		}
	}
});