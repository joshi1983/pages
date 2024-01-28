import { CodeEditor } from '../CodeEditor.js';
import { ClipboardHelper } from '../../ClipboardHelper.js';
const copyItem = CodeEditor.editor.querySelector('#editor-edit-copy');

function getSelectedText() {
	// if CodeEditor's constructor completed but not the initialization of textElement
	// this can happen as WebLogo initializes.
	if (CodeEditor.textElement === undefined)
		return '';
	return CodeEditor.textElement.getSelectedText();
}

function copyToClipboard() {
	ClipboardHelper.copyStringToClipboard(getSelectedText());
}

function refreshDisabled() {
	let title = 'Copy selected text from the code editor';
	if (getSelectedText().trim().length > 0) {
		copyItem.removeAttribute('disabled');
	}
	else {
		copyItem.setAttribute('disabled', true);
		title += ' (Can not copy since no text is selected)';
	}
	copyItem.setAttribute('title', title);
}

copyItem.addEventListener('click', copyToClipboard);
setInterval(refreshDisabled, 1000);
refreshDisabled();