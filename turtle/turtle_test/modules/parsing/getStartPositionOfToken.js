import { StringUtils } from '../StringUtils.js';
import { Token } from './Token.js';

/*
Returns the colIndex and lineIndex for the first character of the specified token.
*/
export function getStartPositionOfToken(token, code) {
	if (!(token instanceof Token))
		throw new Error('token must be a Token.  Not: ' + token);
	if (typeof code !== 'string')
		throw new Error('code must be a string.  Not: ' + code);
	const countLineBreaks = StringUtils.countChar(token.s, '\n');
	if (countLineBreaks === 0) {
		return [token.colIndex - token.s.length + 1, token.lineIndex];
	}
	else {
		let lineIndex = token.lineIndex - countLineBreaks;
		if (token.s.endsWith('\n'))
			lineIndex++;
		let lineBreakIndex1;
		if (lineIndex === 0)
			lineBreakIndex1 = -1;
		else
			lineBreakIndex1 = StringUtils.indexOfNthOccurrance(code, 0, '\n', lineIndex - 1);
		const lineBreakIndex2 = StringUtils.indexOfNthOccurrance(code, lineBreakIndex1 + 1, '\n', 0);
		const indexOfLineBreak = token.s.indexOf('\n');
		let colIndex = lineBreakIndex2 - lineBreakIndex1 - indexOfLineBreak - 1;

		return [colIndex, lineIndex];
	}
};