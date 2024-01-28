import { getParseTokensSorted } from '../parse-tree-token/getParseTokensSorted.js';
import { StringBuffer } from '../../StringBuffer.js';

function getStartLineIndex(token) {
	if (typeof token.val !== 'string')
		return token.lineIndex;
	return token.lineIndex - token.val.split('\n').length + 1;
}

function getStartColIndex(token) {
	if (typeof token.val !== 'string')
		return token.colIndex;
	if (token.val.indexOf('\n') !== -1)
		return undefined;
	return token.colIndex - token.val.length + 1;
}

export function parseTreeTokensToCode(tokens) {
	if (!(tokens instanceof Array))
		throw new Error(`Expected tokens to be an Array but got ${tokens}`);
	tokens = tokens.filter(t => t.val !== null);
	const result = new StringBuffer();
	getParseTokensSorted(tokens);
	let lineIndex = 0;
	let colIndex = 0;
	for (let i = 0; i < tokens.length; i++) {
		const nextToken = tokens[i];
		const tokenStartLineIndex = getStartLineIndex(nextToken);
		const tokenStartColIndex = getStartColIndex(nextToken);
		if (tokenStartLineIndex > lineIndex) {
			result.append('\n'.repeat(tokenStartLineIndex - lineIndex));
			lineIndex = tokenStartLineIndex;
			colIndex = 0;
		}
		if (!Number.isInteger(tokenStartColIndex) ||
		colIndex < tokenStartColIndex - 1)
			result.append(' ');
		result.append(nextToken.val);
		lineIndex = nextToken.lineIndex;
		colIndex = nextToken.colIndex;
	}
	return result.toString();
};