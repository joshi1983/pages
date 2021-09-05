import { escapeHTML } from '../../helpers/escapeHTML.js';
import { getTextPositionFromElement } from '../../../modules/components/syntax-highlighter/getTextPositionFromElement.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testAtStart(logger) {
	const container = document.createElement('div');
	const e = document.createElement('span');
	e.innerText = '"red';
	container.appendChild(e);
	const result = getTextPositionFromElement(e, container);
	if (result[0] !== 0)
		logger(`Expected line 0 but got ${result[0]}`);
	if (result[1] !== 3)
		logger(`Expected line 3 but got ${result[1]}`);
}

function testAtMiddle(logger) {
	const container = document.createElement('div');
	const beforeE = document.createElement('span');
	beforeE.innerText = 'hello';
	const afterE = document.createElement('span');
	afterE.innerText = 'bye';
	const e = document.createElement('span');
	e.innerText = '"red';
	container.appendChild(beforeE);
	container.appendChild(e);
	container.appendChild(afterE);
	const result = getTextPositionFromElement(e, container);
	if (result[0] !== 0)
		logger(`Expected line 0 but got ${result[0]}`);
	const expectedColNumber = beforeE.innerText.length + 3;
	if (result[1] !== expectedColNumber)
		logger(`Expected column ${expectedColNumber} but got ${result[1]}`);
}

function testAtEnd(logger) {
	const container = document.createElement('div');
	const beforeE = document.createElement('span');
	beforeE.innerText = 'hello';
	const e = document.createElement('span');
	e.innerText = '"red';
	container.appendChild(beforeE);
	container.appendChild(e);
	const result = getTextPositionFromElement(e, container);
	if (result[0] !== 0)
		logger(`Expected line 0 but got ${result[0]}`);
	const expectedColNumber = beforeE.innerText.length + 3;
	if (result[1] !== expectedColNumber)
		logger(`Expected column ${expectedColNumber} but got ${result[1]}`);
}

function testNested(logger) {
	const container = document.createElement('div');
	const beforeE = document.createElement('span');
	beforeE.innerText = 'hello';
	const afterE = document.createElement('span');
	afterE.innerText = 'bye';
	const parentE = document.createElement('span');
	const e = document.createElement('span');
	e.innerText = '"red';
	const childBefore = document.createElement('span');
	childBefore.innerHTML = '\n';
	parentE.appendChild(childBefore);
	parentE.appendChild(e);
	container.appendChild(beforeE);
	container.appendChild(parentE);
	container.appendChild(afterE);
	const cases = [{
		'innerHTMLBeforeE': '',
		'innerHTMLChildBefore': '',
		'out': [0, 3]
	},{
		'innerHTMLBeforeE': 'hello',
		'innerHTMLChildBefore': '',
		'out': [0, 8]
	},{
		'innerHTMLBeforeE': 'hel',
		'innerHTMLChildBefore': '',
		'out': [0, 6]
	},{
		'innerHTMLChildBefore': '\n',
		'out': [1, 3]
	},{
		'innerHTMLChildBefore': '\n\n',
		'out': [2, 3]
	},{
		'innerHTMLChildBefore': '\nsjfsdfshdf\n',
		'out': [2, 3]
	},{
		'innerHTMLChildBefore': '\nhi',
		'out': [1, 5]
	},{
		'innerHTMLChildBefore': 'sdfsdf\n',
		'out': [1, 3]
	}];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if (caseInfo.innerHTMLChildBefore !== undefined)
			childBefore.innerHTML = caseInfo.innerHTMLChildBefore;
		if (caseInfo.innerHTMLBeforeE !== undefined)
			beforeE.innerHTML = caseInfo.innerHTMLBeforeE;
		const result = getTextPositionFromElement(e, container);
		if (result[0] !== caseInfo.out[0])
			plogger(escapeHTML(`Expected line ${caseInfo.out[0]} but got ${result[0]}. container innerText = ${container.innerText}`));
		if (result[1] !== caseInfo.out[1])
			plogger(escapeHTML(`Expected column index ${caseInfo.out[1]} but got ${result[1]}, container innerText = ${container.innerText}`));
	});
}

function testUsingDivsForLines(logger) {
	const cases = [
	{'html': '<span id="me">m</span>', 'out': [0, 0]},
	{'html': ' <span id="me">m</span>', 'out': [0, 1]},
	{'html': '<span>to</span><span id="me">m</span>', 'out': [0, 2]},
	{'html': '<span>to</span> <span id="me">m</span>', 'out': [0, 3]},
	{'html': '<div></div><span id="me">m</span>', 'out': [1, 0]},
	{'html': '<div></div><div></div><span id="me">m</span>', 'out': [2, 0]},
	{'html': '<div></div><div></div><span>to</span> <span id="me">m</span>', 'out': [2, 3]},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const container = document.createElement('div');
		container.innerHTML = caseInfo.html;
		const span = container.querySelector(`[id="me"]`);
		const result = getTextPositionFromElement(span, container);
		if (!(result instanceof Array))
			plogger(`Expected an Array but got ${result}`);
		else if (result.length !== 2)
			plogger(`Expected length to be 2 but got ${result.length}`);
		else {
			if (result[0] !== caseInfo.out[0])
				plogger(`Expected [0] to be ${caseInfo.out[0]} but got ${result[0]}`);
			if (result[1] !== caseInfo.out[1])
				plogger(`Expected [1] to be ${caseInfo.out[1]} but got ${result[1]}`);
		}
	});
}

export function testGetTextPositionFromElement(logger) {
	wrapAndCall([
		testAtStart,
		testAtMiddle,
		testAtEnd,
		testNested,
		testUsingDivsForLines
	], logger);
};