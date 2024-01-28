import { CodeEditor } from '../components/CodeEditor.js';
const fileEditItem = document.getElementById('file-edit');
const commanderEdallButton = document.getElementById('commander-edit-all');

function showEditor() {
	CodeEditor.show();
	refreshDisabled();
}

function refreshDisabled() {
	let title = 'Edit procedures and other code';
	if (CodeEditor.isVisible) {
		commanderEdallButton.setAttribute('disabled', '');
		fileEditItem.setAttribute('disabled', '');
		title += ' (Editor already open)';
	}
	else {
		commanderEdallButton.removeAttribute('disabled');
		fileEditItem.removeAttribute('disabled');
	}
	fileEditItem.setAttribute('title', title);
	commanderEdallButton.setAttribute('title', title);
}

fileEditItem.addEventListener('click', showEditor);
commanderEdallButton.addEventListener('click', showEditor);

setInterval(refreshDisabled, 1000);
refreshDisabled();