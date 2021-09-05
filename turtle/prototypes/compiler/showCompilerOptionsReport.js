import { compileOptionsArray } from '../../tests/parsing/execution/compileOptionsArray.js';
import { fetchText } from '../../modules/fetchText.js';
import { getResultsForCode } from './getResultsForCode.js';
import { showDialog } from '../helpers/showDialog.js';
import { StringBuffer } from '../../modules/StringBuffer.js';

const html = await fetchText('prototypes/compiler/compiler-options-report.html');

function compileOptionsToHTML(obj) {
	const obj2 = JSON.parse(JSON.stringify(obj));
	delete obj2.name;
	const result = new StringBuffer();
	result.append('<span class="curly-bracket">{</span>');
	for (const key in obj2) {
		result.append(`<div class="key-value-pair"><span class="key">"${key}"</span>: <span class="value">${obj[key]}</span></div>`);
	}
	result.append('<span class="curly-bracket">}</span>');
	return result.toString();
}

export function showCompilerOptionsReport(code) {
	showDialog('Compiler Options Report', html);
	const container = document.getElementById('compiler-options-container');
	container.innerText = '';
	const testResults = getResultsForCode(code);
	compileOptionsArray.forEach(function(compileOptions, index) {
		const row = document.createElement('div');
		if (testResults[index].isError)
			row.classList.add('error');
		const nameDiv = document.createElement('div');
		nameDiv.classList.add('name');
		nameDiv.innerText = compileOptions.name;
		row.appendChild(nameDiv);
		const formattedDiv = document.createElement('div');
		formattedDiv.classList.add('formatted');
		formattedDiv.innerHTML = compileOptionsToHTML(compileOptions);
		row.appendChild(formattedDiv);
		container.appendChild(row);
	});
};