import { CodeEditor } from '../CodeEditor.js';
import { ClipboardHelper } from '../../ClipboardHelper.js';
const pasteItem = CodeEditor.editor.querySelector('#editor-edit-paste');

if (!ClipboardHelper.isSupportingPaste())
	pasteItem.remove();
else {
	function pasteClicked() {
		ClipboardHelper.pasteFromClipboardAsync().then(function(text) {
			CodeEditor.textElement.insertTextAtCursor(text);
		});
	}

	pasteItem.addEventListener('click', pasteClicked);
}

