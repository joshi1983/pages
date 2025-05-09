let callback;

function onPaste(event) {
	const items = (event.clipboardData || event.originalEvent.clipboardData).items;
	for (let item of items) {
		if (item.kind === 'string') {
			item.getAsString(function(result) {
				callback('pasted-text.txt', 'data:text/plain;base64,' + btoa(result));
			});
		}
		else if (item.kind === 'file') {
			const blob = item.getAsFile();
			const reader = new FileReader();
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
		this.deactivate();
		if (callback === undefined)
			document.addEventListener('paste', onPaste);
		callback = callback_;
	}

	deactivate(callbackToDeactivate) {
		if (callback === undefined)
			return; // nothing to deactivate.
		if (callbackToDeactivate !== undefined && callback !== callbackToDeactivate)
			return; // not matching the specified function so do not deactivate.
		document.removeEventListener('paste', onPaste);
		callback = undefined;
	}
};

const AssetPasteListener = new MyAssetPasteListener();

export { AssetPasteListener };