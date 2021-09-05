import { argumentToEnglish } from '../command-details/dataTypesToEnglish.js';

const argNames = ['leftValue', 'rightValue'];

export function processOperatorInputs(commandInfo) {
	const ol = document.getElementById('operator-inputs');
	ol.innerHTML = '';
	commandInfo.args.forEach(function(arg, index) {
		const li = document.createElement('li');
		const name = document.createElement('span');
		name.classList.add('name');
		const remaining = document.createElement('span');
		remaining.innerText = argumentToEnglish(arg);
		name.innerText = argNames[index];
		li.appendChild(name);
		li.appendChild(remaining);
		ol.appendChild(li);
	});
};