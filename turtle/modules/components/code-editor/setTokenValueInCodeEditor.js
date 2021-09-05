import { Code } from './Code.js';
import { CodeEditor } from '../CodeEditor.js';
import { getSourceCodeWithTokenValueReplacement } from './getSourceCodeWithTokenValueReplacement.js';

export function setTokenValueInCodeEditor(oldSourceCode, parseTreeToken, newValue) {
	if (typeof oldSourceCode !== 'string')
		throw new Error(`oldSourceCode must be a string but got ${oldSourceCode}`);
	const newSourceCode = getSourceCodeWithTokenValueReplacement(oldSourceCode, parseTreeToken, newValue);
	Code.setSourceCode(newSourceCode);
	CodeEditor.textElement.dispatchChanged(); // trigger a refresh.
};