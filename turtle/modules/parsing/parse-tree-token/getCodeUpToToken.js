import { StringBuffer } from '../../StringBuffer.js';

export function getCodeUpToToken(code, token) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string but got ${code}`);
	while (token.val === null && token.children.length !== 0) {
		token = token.children[0];
	}
	const result = new StringBuffer();
	const lines = code.split('\n');
	let i;
	for (i = 0; i < token.lineIndex; i ++) {
		result.append(lines[i] + '\n');
	}
	let ending = '';
	let s = token.originalString;
	if (s === undefined)
		s = '' + token.val;
	if (token.colIndex > 0) {
		ending = lines[token.lineIndex].substring(0, token.colIndex + 1 - s.length);
	}
	return result.toString() + ending;
};