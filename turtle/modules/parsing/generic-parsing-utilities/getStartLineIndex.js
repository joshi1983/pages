import { StringUtils } from
'../../StringUtils.js';

/*
token could be either a ParseTreeToken or a Token from the scanner.
*/
export function getStartLineIndex(token) {
	const s = token.val === undefined ? token.s : token.val;
	if (typeof s !== 'string')
		return token.lineIndex;
	return token.lineIndex - StringUtils.countChar(s, '\n');
};