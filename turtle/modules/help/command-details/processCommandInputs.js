import { argumentToEnglish, dataTypesToEnglish } from './dataTypesToEnglish.js';

export function processCommandInputs(commandInfo) {
	const ol = document.getElementById('command-inputs');
	ol.innerHTML = '';
	const noCommandInputsStyle = document.getElementById('no-command-inputs').style;
	if (commandInfo.args === undefined || commandInfo.args.length === 0)
		noCommandInputsStyle.display = 'inline';
	else {
		noCommandInputsStyle.display = 'none';
		commandInfo.args.forEach(function(arg) {
			const li = document.createElement('li');
			const name = document.createElement('span');
			name.innerText = arg.name;
			name.classList.add('name');
			const remaining = document.createElement('span');
			remaining.innerText = argumentToEnglish(arg);
			li.appendChild(name);
			li.appendChild(remaining);
			if (typeof arg.description === 'string') {
				const p = document.createElement('p');
				p.innerText = arg.description;
				li.appendChild(p);
			}
			ol.appendChild(li);
		});
	}
};