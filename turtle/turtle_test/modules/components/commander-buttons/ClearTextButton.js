import { CommandBoxMessages } from '../CommandBoxMessages.js';
const clearTextButton = document.getElementById('commander-clear-text');
function clearText() {
	CommandBoxMessages.clear();
}

function refreshEnabled() {
	let title = 'Clear commander text';
	if (CommandBoxMessages.isEmpty()) {
		clearTextButton.setAttribute('disabled', true);
		title += ' (Already cleared)';
	}
	else {
		clearTextButton.removeAttribute('disabled');
	}
	clearTextButton.setAttribute('title', title);
}

clearTextButton.addEventListener('click', clearText);
CommandBoxMessages.addEventListener('isEmptyChanged', refreshEnabled);

refreshEnabled();