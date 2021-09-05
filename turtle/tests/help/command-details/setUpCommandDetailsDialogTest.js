export function setUpCommandDetailsDialogTest() {
	// simulate the document state of a Command Details dialog being open.
	const e = document.createElement('ol');
	e.id = 'command-inputs';
	const extraArgsInfoElement = document.createElement('div');
	extraArgsInfoElement.id = 'command-inputs-extra';
	const noCommandInputsElement = document.createElement('div');
	noCommandInputsElement.id = 'no-command-inputs';
	const noCommandOutputElement = document.createElement('div');
	noCommandOutputElement.id = 'no-command-output';
	const commandOutputTypesElement = document.createElement('div');
	commandOutputTypesElement.id = 'command-output-types';
	document.body.appendChild(e);
	document.body.appendChild(noCommandInputsElement);
	document.body.appendChild(noCommandOutputElement);
	document.body.appendChild(commandOutputTypesElement);
	document.body.appendChild(extraArgsInfoElement);
};