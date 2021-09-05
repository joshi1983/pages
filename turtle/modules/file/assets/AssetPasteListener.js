let callback;

function onPaste(event) {
	var items = (event.clipboardData || event.originalEvent.clipboardData).items;
	for (let item of items) {
		if (item.kind === 'string') {
			item.getAsString(function(result) {
				callback('pasted-text.txt', 'data:text/plain;base64,' + btoa(result));
			});
		}
		else if (item.kind === 'file') {
			var blob = item.getAsFile();
			var reader = new FileReader();
			reader.onload = function(event){
				const dataUrl = event.target.result;
				callback(blob.name, dataUrl);
			};
			reader.readAsDataURL(blob);
		}
	}
}

class MyAssetPasteListener {
	activate(callback_) {
		if (typeof callback_ !== 'function')
			throw new Error(`The callback must be a function but got ${callback_}`);
		if (callback === callback_)
			return; // nothing to change.
		if (callback === undefined)
			document.addEventListener('paste', onPaste);
		callback = callback_;
	}

	deactivate() {
		if (callback === undefined)
			return; // nothing to deactivate.
		document.removeEventListener('paste', onPaste);
		callback = undefined;
	}
};

const AssetPasteListener = new MyAssetPasteListener();

export { AssetPasteListener };