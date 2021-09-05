import { StringUtils } from
'../../StringUtils.js';

/*
token could be either a ParseTreeToken or a Token from the scanner.
*/
export function getStartColOffset(token, codeLines) {
	let s;
	if (token.s !== undefined) {
		s = token.s;
	} else {
		s = token.val;
		if (typeof token.originalString === 'string')
			s = token.originalString;
		if (token.children.length === 0)
			s = token.toString();
		if (s === null)
			return token.colIndex;
	}
	if (typeof codeLines === 'string')
		codeLines = codeLines.split('\n');
	const lineCount = StringUtils.countChar(s, '\n');
	if (lineCount === 0)
		return token.colIndex - s.length + 1;
	else {
		const index = s.indexOf('\n');
		const line = codeLines[token.lineIndex - lineCount];
		return line.length - index;
	}
};