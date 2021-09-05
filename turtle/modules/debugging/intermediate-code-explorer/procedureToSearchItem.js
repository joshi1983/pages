import { Procedure } from '../../parsing/Procedure.js';
const globalInfo = {
	'name': '-Global Section-',
	'parameters': []
};

export function procedureToSearchItem(procedure, selectCallback) {
	if (procedure === null)
		procedure = globalInfo;
	else if (!(procedure instanceof Procedure))
		throw new Error('Procedure required');
	if (typeof selectCallback !== 'function')
		throw new Error('selectCallback must be a function');

	const result = document.createElement('div');
	const nameElement = document.createElement('div');
	nameElement.classList.add('name');
	nameElement.innerText = procedure.name;
	result.appendChild(nameElement);
	const paramsElement = document.createElement('div');
	paramsElement.classList.add('parameters');
	paramsElement.innerText = procedure.parameters.map(p => ':' + p).join(' ');
	result.appendChild(paramsElement);
	result.addEventListener('click', function() {
		selectCallback(procedure);
	});
	return result;
};