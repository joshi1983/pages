import { CodeEditor } from '../CodeEditor.js';
import { harmonizeCase } from './harmonize-case/harmonizeCase.js';
const harmonizeCache = new Map();
const harmonizeCaseItem = CodeEditor.editor.querySelector('#editor-harmonize-case');;

function harmonizeCaseClicked() {
	// get the current code.
	const harmonized = getHarmonizedCase();
	CodeEditor.setSourceCode(harmonized);
	refreshDisabled();
}

function getHarmonizedCase() {
	const code = CodeEditor.getSourceCode();
	if (harmonizeCache.has(code))
		return harmonizeCache.get(code);
	const harmonized = harmonizeCase(code);

	// empty once in a while to avoid using too much RAM.
	if (harmonizeCache.size > 5)
		harmonizeCache.clear();

	harmonizeCache.set(code, harmonized);
	return harmonized;
}

function refreshDisabled() {
	const harmonized = getHarmonizedCase();
	let title = 'Automatically rename variable names, procedures, and commands to the same case to improve readability and consistency';
	if (harmonized !== CodeEditor.getSourceCode()) {
		harmonizeCaseItem.removeAttribute('disabled');
	}
	else {
		title += ' (Already same as after harmonizing case)';
		harmonizeCaseItem.setAttribute('disabled', '');
	}
	harmonizeCaseItem.setAttribute('title', title);
}

harmonizeCaseItem.addEventListener('click', harmonizeCaseClicked);
setInterval(refreshDisabled, 2000);