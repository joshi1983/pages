export class ClipboardHelper {
	static getCursorPosition(element) {
		const startPosition = element.selectionStart;
		const endPosition = element.selectionEnd;
		if (startPosition === endPosition)
			return startPosition;
	}

	// Implementation from: 
	// https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
	// Always returns a Promise.
	static copyStringToClipboard(str) {
		if (navigator.clipboard !== undefined && typeof navigator.clipboard.writeText === 'function')
			return navigator.clipboard.writeText(str);
		else {
			// Create new element
			const el = document.createElement('textarea');
			// Set value (string to be copied)
			el.value = str;
			// Set non-editable to avoid focus and move outside of view
			el.setAttribute('readonly', '');
			el.style = {'position': 'absolute', 'left': '-9999px'};
			document.body.appendChild(el);
			// Select text inside element
			el.select();
			// Copy text to clipboard
			document.execCommand('copy');
			// Remove temporary element
			document.body.removeChild(el);
			return Promise.resolve();
		}
	}

	// isSupportingPaste() will return false for some versions of Firefox.
	static isSupportingPaste() {
		return (Clipboard !== undefined && typeof Clipboard.readText === 'function') ||
			(typeof navigator.clipboard !== undefined && typeof navigator.clipboard.readText === 'function');
	}

	// Call this only if isSupportingPaste() returns true.
	static pasteFromClipboardAsync() {
		if (!ClipboardHelper.isSupportingPaste())
			throw new Error('ClipboardHelper.isSupportingPaste() returns false so this should not be called.  Change the caller to avoid calling this when isSupportingPaste() returns false');
		if (Clipboard !== undefined && typeof Clipboard.readText === 'function')
			return Clipboard.readText();
		else
			return navigator.clipboard.readText();
	}
};