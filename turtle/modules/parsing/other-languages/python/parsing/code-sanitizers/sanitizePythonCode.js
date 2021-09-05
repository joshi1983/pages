import { removeErroneousLinePrefixes } from './removeErroneousLinePrefixes.js';
import { replaceInvalidIndentationSymbols } from './replaceInvalidIndentationSymbols.js';
import { sanitizeIndentation } from './sanitizeIndentation.js';

function trim(code) {
	return code.trim();
}

const sanitizers = [
	removeErroneousLinePrefixes,
	replaceInvalidIndentationSymbols,
	sanitizeIndentation,
	trim,
];

export function sanitizePythonCode(code) {
	sanitizers.forEach(function(sanitize) {
		code = sanitize(code);
	});
	return code;
};