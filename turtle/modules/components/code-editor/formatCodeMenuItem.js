import { CodeEditor } from '../CodeEditor.js';
import { formatCode } from './format/formatCode.js';

const formatItem = CodeEditor.editor.querySelector('#editor-format-code');
const formatCache = new Map();

function getSanitizedCode() {
	return CodeEditor.getSourceCode().trim();
}

function getFormattedCode() {
	const code = getSanitizedCode();
	if (formatCache.has(code))
		return formatCache.get(code);
	const formatted = formatCode(code);
	formatCache.clear();
	formatCache.set(code, formatted);
	return formatted;
}

function formatClicked() {
	// get the current code.
	const formatted = getFormattedCode();
	CodeEditor.setSourceCode(formatted);
}

function mightFormattingBeUseful() {
	const code = getSanitizedCode();
	const formatted = getFormattedCode();
	return formatted !== code;
}

function refreshDisabled() {
	let title = 'Automatically format code to improve readability and consistency';
	if (mightFormattingBeUseful())
		formatItem.removeAttribute('disabled');
	else {
		title += ' (Already same as after auto-formatting)';
		formatItem.setAttribute('disabled', '');
	}
	formatItem.setAttribute('title', title);
}

formatItem.addEventListener('click', formatClicked);
setInterval(refreshDisabled, 1000);