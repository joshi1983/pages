import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchText } from '../fetchText.js';
import { fetchJson } from '../fetchJson.js';
import { processHelpLinks } from './processHelpLinks.js';
import { PushStates } from '../components/PushStates.js';
const operators = await fetchJson('json/operators.json');
const helpOperatorsHTML = await fetchText('content/help/logo-language-topics/help-operators.html');

function createDivForOperator(op) {
	const result = document.createElement('div');
	result.appendChild(createDivForSymbol(op.symbol));
	return result;
}

function createDivForSymbol(symbol) {
	const symbolDiv = document.createElement('div');
	symbolDiv.innerText = symbol;
	symbolDiv.classList.add('symbol');
	return symbolDiv;
}

function createHeader(titles) {
	const result = document.createElement('div');
	result.classList.add('title');
	titles.forEach(function(titleInfo) {
		const title = (typeof titleInfo === 'object') ? titleInfo.text : titleInfo;
		const className = (typeof titleInfo === 'object') ? titleInfo.className : (titleInfo === '' ? 'symbol' : '');
		const titleElement = document.createElement('div');

		titleElement.innerText = title;
		if (className !== '')
			titleElement.classList.add(className);
		result.appendChild(titleElement);
	});
	return result;
}

function createNameElement(name) {
	const nameDiv = document.createElement('div');
	nameDiv.classList.add('name');
	nameDiv.innerText = name;
	return nameDiv;
}

function listOperators(returnType, id) {
	const e = document.getElementById(id);
	e.innerHTML = '';
	e.appendChild(createHeader(['', {'text': 'Name', 'className': 'name'}, 'Similar Command']));
	operators.filter(function(op) {
		return op.returnTypes === returnType || op.returnTypes.indexOf(returnType) !== -1;
	}).forEach(function(op) {
		const opDiv = createDivForOperator(op);
		opDiv.appendChild(createNameElement(op.name));
		const commandDiv = document.createElement('div');
		if (typeof op.similarCommand === 'string') {
			const span = document.createElement('span');
			span.classList.add('command');
			span.innerText = op.similarCommand;
			commandDiv.appendChild(span);
		}
		opDiv.appendChild(commandDiv);
		e.appendChild(opDiv);
	});
}

function listUnaryOperators() {
	const e = document.getElementById('unary-operators');
	e.innerHTML = '';
	e.appendChild(createHeader(['', {'text': 'Name', 'className': 'name'}]));
	operators.filter(o => o.unary !== undefined).
		forEach(function(o) {
			const div = document.createElement('div');
			div.appendChild(createDivForSymbol(o.symbol));
			div.appendChild(createNameElement(o.unary.name));
			e.appendChild(div);
		});
}

function showPrecedence(id) {
	const e = document.getElementById(id);
	e.innerHTML = '';
	e.appendChild(createHeader(['', 'Precedence']));
	operators.forEach(function(op) {
		const opDiv = createDivForOperator(op);
		const precedenceDiv = document.createElement('div');
		precedenceDiv.innerText = '' + op.precedence;
		opDiv.appendChild(precedenceDiv);
		e.appendChild(opDiv);
	});
}

export function showOperatorsHelp(autoPushState) {
	if (autoPushState !== false) {
		PushStates.add(function() {
			showOperatorsHelp(false);
		});
	}
	Dialog.show(helpOperatorsHTML, 'Operators', undefined, undefined, {
		'className': 'help-operators',
		'groupId': DialogGroups.HELP,
		'iconClass': 'dialog-icon operators-icon'
	});
	listOperators('num', 'num-operators');
	listOperators('bool', 'bool-operators');
	listUnaryOperators();
	showPrecedence('operator-precedence');
	processHelpLinks();
};