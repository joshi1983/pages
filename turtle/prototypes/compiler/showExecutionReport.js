import { compileOptionsArray } from '../../tests/parsing/execution/compileOptionsArray.js';
import { Dialog } from '../../modules/components/Dialog.js';
import { fetchText } from '../../modules/fetchText.js';
import { getResultsForCode } from './getResultsForCode.js';
import { HaltType } from './HaltType.js';

const html = await fetchText('prototypes/compiler/execution-report.html');

function resultsInfoToDiv(compileOptions, resultsInfo) {
	const result = document.createElement('div');
	const optionsName = document.createElement('div');
	if (compileOptions === undefined)
		optionsName.innerText = 'Options Name';
	else
		optionsName.innerText = compileOptions.name;
	optionsName.classList.add('compile-options-name');
	result.appendChild(optionsName);
	const numPrinted = document.createElement('div');
	if (resultsInfo === undefined)
		numPrinted.innerText = '# Messages';
	else
		numPrinted.innerText = '' + resultsInfo.messages.length;
	numPrinted.classList.add('messages-length');
	if (resultsInfo !== undefined && resultsInfo.isMessageError)
		numPrinted.classList.add('error');
	result.appendChild(numPrinted);
	const numShapes = document.createElement('div');
	if (compileOptions === undefined)
		numShapes.innerText = '# Shapes';
	else
		numShapes.innerText = '' + resultsInfo.shapes.length;
	numShapes.classList.add('shapes-length');
	if (resultsInfo !== undefined && resultsInfo.isShapeError)
		numShapes.classList.add('error');
	result.appendChild(numShapes);
	const haltType = document.createElement('div');
	if (resultsInfo === undefined)
		haltType.innerText = 'Halt Type';
	else {
		const name = HaltType.getNameFor(resultsInfo.haltType);
		haltType.innerText = name;
		haltType.classList.add(name);
	}
	haltType.classList.add('halt-type');
	result.appendChild(haltType);
	return result;
}

export function showExecutionReport(code) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string but got ${code}`);

	Dialog.show(html, 'Execution Report', 400, 300);
	const container = document.getElementById('execution-report-container');
	container.innerText = '';
	container.appendChild(resultsInfoToDiv());
	const resultsInfo = getResultsForCode(code);
	compileOptionsArray.forEach(function(compileOptions, index) {
		const div = resultsInfoToDiv(compileOptions, resultsInfo[index]);
		container.appendChild(div);
	});
};