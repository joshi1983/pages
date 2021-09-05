import { dataTypesToEnglish } from './dataTypesToEnglish.js';

export function processExtraCommandInputs(commandInfo) {
	const id = 'command-inputs-extra';
	const e = document.getElementById(id);
	if (e === null)
		throw new Error(`Unable to find element with id ${id}`);
	if (commandInfo.extraArgsInfo === undefined) {
		e.style.removeProperty('display');
	}
	else {
		e.style.display = 'block';
		const span = document.getElementById('command-extra-inputs');
		span.innerText = dataTypesToEnglish(commandInfo.extraArgsInfo.types);
	}
};