import { Code } from './Code.js';
import { CodeEditor } from '../CodeEditor.js';
import { formatCode } from './format/formatCode.js';

const formatItem = CodeEditor.editor.querySelector('#editor-format-code');
const formatCache = new Map();

function getSanitizedCode() {
	return CodeEditor.getSourceCode().trim();
}

async function getFormattedCode() {
	const code = getSanitizedCode();
	if (formatCache.has(code))
		return formatCache.get(code);
	await Code.refreshTree();
	let tree;
	if (Code.isTreeUpToDate()) {
		tree = Code.tree_;
		const formatted = formatCode(code, tree, Code.isTreeUpToDateAndParsedWithoutError());
		formatCache.clear();
		formatCache.set(code, formatted);
		return formatted;
	}
	else {
		formatCache.set(code, code);
		return code;
	}
}

async function formatClicked() {
	// get the current code.
	const formatted = await getFormattedCode();
	CodeEditor.setSourceCode(formatted);
}

async function mightFormattingBeUseful() {
	const code = getSanitizedCode();
	const formatted = await getFormattedCode();
	return formatted !== code;
}

function refreshDisabled() {
	let title = 'Automatically format code to improve readability and consistency';
	mightFormattingBeUseful().then(function(formattingUseful) {
		if (formattingUseful) {
			formatItem.removeAttribute('disabled');
		}
		else {
			title += ' (Already same as after auto-formatting)';
			formatItem.setAttribute('disabled', '');
		}
		formatItem.setAttribute('title', title);
	}).catch(function(e) {
		if (e !== 'cancel')
			console.error('Error thrown while calculating mightFormattingBeUseful(), e=', e);
	});
}

formatItem.addEventListener('click', formatClicked);
setInterval(refreshDisabled, 1000);