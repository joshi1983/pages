import { ready } from
'../../ready.js';

const statusModules = [
	'DebuggerMenuStatus',
	'ExampleRunStatus',
	'ExamplesParseStatus',
	'ExecutionSpeedMenuItemStatus',
	'FileMenuStatus',
	'LayoutRefreshStatus',
	'SettingsLoadStatus',
	'ZippedExamplesStatus'
];

let okButton, dialog, messagesContainer, tipDiv,
	closeASAP = true;
const statuses = [];

function updateButtonCaption() {
	okButton.innerText = 'OK';
	okButton.removeAttribute('disabled');
}

function shouldButtonSayOK() {
	return statuses.every(status => status._isCompleted);
}

function checkIsCompleted() {
	if (shouldButtonSayOK()) {
		if (closeASAP)
			close();
		else
			updateButtonCaption();
	}
}

async function initializeStatuses() {
	for (const statusName of statusModules) {
		const statusURL = `./${statusName}.js`;
		const statusItem = (await import(statusURL))[statusName];
		if (typeof statusItem !== 'object')
			console.error(`Expected an object for ${statusName} but statusItem=${statusItem}`);

		statusItem.addCompleteListener(checkIsCompleted);
		statuses.push(statusItem);
		updateMessages();
	}
}

function close() {
	dialog.remove();
}

function turnOnImmediateClose() {
	if (shouldButtonSayOK() && tipDiv === undefined)
		close();

	okButton.innerText = 'Closing after checklist';
	closeASAP = true;
}

function buttonClicked() {
	turnOnImmediateClose();
}

function tipTimeLimitReached() {
	if (shouldButtonSayOK())
		close();

	turnOnImmediateClose();
}

function updateMessages() {
	if (messagesContainer !== undefined) {
		messagesContainer.innerText = '';
		if (tipDiv !== undefined)
			messagesContainer.appendChild(tipDiv);

		for (const statusItem of statuses) {
			messagesContainer.appendChild(statusItem.e);
		}
	}
}

export function setTipContent(html) {
	if (typeof html !== 'string')
		throw new Error(`html must be a string but found ${html}`);

	tipDiv = document.createElement('div');
	tipDiv.innerHTML = html;
	updateMessages();
	setTimeout(tipTimeLimitReached, 5000);
};

function init() {
	messagesContainer = document.getElementById('loading-dialog-messages');
	dialog = document.getElementById('loading-dialog');
	okButton = document.getElementById('loading-dialog-ok');
	okButton.addEventListener('click', buttonClicked);
	initializeStatuses();
}

ready(init);