import { argumentToEnglish } from './dataTypesToEnglish.js';
import { DataTypes } from '../../parsing/data-types/DataTypes.js';
import { dataTypesToEnglish } from './dataTypesToEnglish.js';
import { getListOrStringExpressionFromArg } from './getListOrStringExpressionFromArg.js';
import { isNumber } from '../../isNumber.js';
import { processExtraCommandInputs } from './processExtraCommandInputs.js';
import { processFormat } from './processFormat.js';
import { valuesToStringExpression } from './valuesToStringExpression.js';

export function processCommandInputs(commandInfo) {
	const ol = document.getElementById('command-inputs');
	ol.innerHTML = '';
	processExtraCommandInputs(commandInfo);
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
			remaining.innerText = argumentToEnglish(arg, false);
			li.appendChild(name);
			li.appendChild(remaining);
			if (typeof arg.description === 'string') {
				const p = document.createElement('p');
				p.innerText = arg.description;
				li.appendChild(p);
			}
			let errorCasesHandled = false;
			let minHandled = false;
			let maxHandled = false;
			if (arg.errorCases !== undefined && arg.errorCases.length === 1 &&
			isNumber(arg.errorCases[0])) {
				const errorCase = arg.errorCases[0];
				let msg;
				if (errorCase === arg.min) {
					msg = 'greater';
					minHandled = true;
				}
				else if (errorCase === arg.max) {
					msg = 'less';
					maxHandled = true;
				}
				if (msg !== undefined) {
					errorCasesHandled = true;
					const p = document.createElement('p');
					p.innerText = `${arg.name} must strictly ${msg} than ${errorCase}.`;
					li.appendChild(p);
				}
			}
			if (errorCasesHandled === false && arg.errorCases instanceof Array) {
				const p = document.createElement('p');
				p.innerText = `${arg.name} must not be ${valuesToStringExpression(arg.errorCases)}.`;
				li.appendChild(p);
			}
			if (arg.uselessCases instanceof Array) {
				const p = document.createElement('p');
				p.innerText = `${arg.name} should not always be ${valuesToStringExpression(arg.uselessCases)} or the command won't do anything useful.`;
				li.appendChild(p);
			}
			if ((minHandled === false && arg.min !== undefined) ||
			(maxHandled === false && arg.max !== undefined)) {
				const p = document.createElement('p');
				let msg;
				if (arg.min !== undefined && arg.max !== undefined)
					msg = `between ${arg.min} and ${arg.max}`;
				else if (arg.min  !== undefined)
					msg = `at least ${arg.min}`;
				else
					msg = `at most ${arg.max}`;
				p.innerText = `${arg.name} must be ${msg}.`;
				li.appendChild(p);
			}
			if (arg.types.startsWith('cproc') &&
			arg.types.indexOf('returntypes=') !== -1 &&
			arg.types.indexOf('returntypes=null') === -1) {
				const dataTypes = new DataTypes(arg.types);
				const cprocTypes = Array.from(dataTypes.types).filter(t => t.name.startsWith('cproc'));
				const cprocType = cprocTypes[0];
				const returntypes = DataTypes.stringify(cprocType.returnTypes);
				const p = document.createElement('p');
				p.innerHTML = '<p>The command or procedure must always return a value. In other ' +
				'words, the <span class="command">stop</span> command is prohibited in your procedure.  All ' +
				'execution paths must end with a call to <span class="command">output</span>.</p><p>The specific types returned are: ' + 
				dataTypesToEnglish(returntypes)+ '</p>';
				li.appendChild(p);
			}
			const listOrStringExpression = getListOrStringExpressionFromArg(arg);
			const charOrElement = arg.types === 'string' ? 'character' : 'element';
			if (typeof arg.listElementTypes === 'string') {
				const p = document.createElement('p');
				p.innerText = `Every list element must be ${argumentToEnglish(arg.listElementTypes, false)}`;
				li.appendChild(p);
			}
			if (Number.isInteger(arg.minLen) && Number.isInteger(arg.maxLen)) {
				const p = document.createElement('p');
				if (arg.minLen === arg.maxLen)
					p.innerText = `${listOrStringExpression} length must be ${arg.minLen}.`;
				else
					p.innerText = `${listOrStringExpression} length must be at least ${arg.minLen} and at most ${arg.maxLen}.`;
				li.appendChild(p);
			}
			else if (Number.isInteger(arg.minLen)) {
				const p = document.createElement('p');
				p.innerText = `${listOrStringExpression} must have at least ${arg.minLen} ${charOrElement}${arg.minLen!==1?'s':''}.`;
				li.appendChild(p);
			}
			else if (Number.isInteger(arg.maxLen)) {
				const p = document.createElement('p');
				p.innerText = `${listOrStringExpression} must have at most ${arg.maxLen} ${charOrElement}${arg.maxLen!==1?'s':''}.`;
				li.appendChild(p);
			}
			if (arg.format !== undefined)
				processFormat(li, arg.format);
			ol.appendChild(li);
		});
	}
};