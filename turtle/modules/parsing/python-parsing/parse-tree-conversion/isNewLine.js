import { isFromPython2Parser } from './isFromPython2Parser.js';

const newLineTexts = new Set(['NEW_LINE', 'NEWLINE']);

function isNewLineText(s) {
	if (typeof s !== 'string')
		return false;
	return newLineTexts.has(s.trim());
}

export function isNewLine(token) {
	if (token.symbol !== undefined) {
		if (!isNewLineText(token.symbol.text))
			return false;
	}
	else if (!isNewLineText(token.text))
		return false;
	if (isFromPython2Parser(token)) {
		return [605, 314, 186, 173].indexOf(token.invokingState) !== -1;
		/*
		Similar to isEndMarker's implementation, the 314 is from source code of the Python2Parser.
		This will very likely break if the library is upgraded.
		Unfortunately, this is also the best option we have.
		token.symbol.text will also be 'NEWLINE' but that value could be used in function names, 
		variable names, class names... and is therefore more problematic than this hardcoded number.
		*/
	}
	return false;
};