import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function addLineOfCodeIfNeeded(prev, next) {
	if (next.lineIndex === prev.lineIndex &&
	prev.parentNode !== null)
		return prev;
	if (next.type === ParseTreeTokenType.PERIOD)
		return prev;

	const lineOfCode = new ParseTreeToken(null, next.lineIndex, next.colIndex,
		ParseTreeTokenType.LINE_OF_CODE);
	prev.appendChild(lineOfCode);
	return lineOfCode;
};
