import { ClipboardHelper } from '../modules/ClipboardHelper.js';

function testCopyPasteSingleString(s, logger) {
	return new Promise(function(resolve, reject) {
		ClipboardHelper.copyStringToClipboard(s).then(function() {
			if (ClipboardHelper.isSupportingPaste()) {
				ClipboardHelper.pasteFromClipboardAsync().then(function(result) {
					if (result !== s)
						logger('Expected to paste string "' + s + '" but got "' + result + '"');
					resolve();
				});
			}
			else
				resolve();
		});
	});
}

export function testClipboardHelper(logger) {
	let allDone = false;
	testCopyPasteSingleString('', logger).then(function() {
		testCopyPasteSingleString('hello', logger).then(function() {
			allDone = true;
		});
	});
	setTimeout(function() {
		if (!allDone) {
			logger("Clipboard tests did not complete within 15 seconds.  If you did not get prompted for permission to write or read the clipboard, the clipboard tests passed.");
		}
	}, 15000);
};