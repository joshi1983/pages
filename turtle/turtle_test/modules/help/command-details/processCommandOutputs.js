import { dataTypesToEnglish } from './dataTypesToEnglish.js';

export function processCommandOutputs(commandInfo) {
	const noCommandOutputStyle = document.getElementById('no-command-output').style;
	const commandOutputTypes = document.getElementById('command-output-types');
	if (commandInfo.returnTypes === null) {
		noCommandOutputStyle.display = 'inline';
		commandOutputTypes.innerText = '';
	}
	else {
		noCommandOutputStyle.display = 'none';
		commandOutputTypes.innerText = dataTypesToEnglish(commandInfo.returnTypes, false);
	}
};