import { isInFunction } from
'../../parsing/parse-tree-analysis/variable-data-types/isInFunction.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const toStopChildTypes = new Set([
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.SUB
]);

const toBreakChildTypes = new Set([
	ParseTreeTokenType.DO,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.WHILE
]);

export function processExit(token, result, options) {
	const child = token.children[0];
	if (child !== undefined) {
		if (toStopChildTypes.has(child.type)) {
			result.append('stop');
			return;
		}
		else if (toBreakChildTypes.has(child.type)) {
			result.append('break');
			return;
		}
	}
	if (isInFunction(token)) {
		result.append('stop');
	}
};