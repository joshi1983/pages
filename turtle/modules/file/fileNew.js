import { Code } from '../components/code-editor/Code.js';
import { CodeEditor } from '../components/CodeEditor.js';
import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchText } from '../fetchText.js';
import { ToastMessages } from '../components/ToastMessages.js';
const html = await fetchText('content/file/new-confirmation.html');

function clearCodeNoConfirmation() {
	Code.setSourceCode('');
	CodeEditor.textElement.setValue('');
	ToastMessages.success('The code has been emptied.', false);
}

function fileNewClicked() {
	const lineCount = Code.getSourceCode().split('\n').length;
	if (lineCount > 5) {
		Dialog.show(html, 'New Confirmation', undefined, undefined, {
			'groupId': DialogGroups.CONFIRMATION,
			'okCaption': 'Yes',
			'okClicked': function() {
				clearCodeNoConfirmation();
				Dialog.hide();
			},
			'showCancel': true
		});
		const lineCountElement = document.getElementById('file-new-confirmation-line-count');
		lineCountElement.innerText = '' + lineCount;
	}
	else
		clearCodeNoConfirmation();
}

const fileNewItem = document.getElementById('file-new');
fileNewItem.addEventListener('click', fileNewClicked);