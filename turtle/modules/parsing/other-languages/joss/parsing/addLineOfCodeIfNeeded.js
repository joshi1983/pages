import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function addLineOfCodeIfNeeded(prev, next) {
	if (prev.parentNode !== null)
		return prev; // LINE_OF_CODE tokens can be added only to a TREE_ROOT.

	if (prev.lineIndex === next.lineIndex &&
	prev.children.length !== 0)
		return prev;
		// We don't want to add a LINE_OF_CODE unless we actually moved to a new line.

	if (next.type === ParseTreeTokenType.PERIOD)
		return prev; // A PERIOD can be added directly to the TREE_ROOT.

	const lineOfCode = new ParseTreeToken(null, next.lineIndex, next.colIndex,
		ParseTreeTokenType.LINE_OF_CODE);
	prev.appendChild(lineOfCode);
	return lineOfCode;
};
