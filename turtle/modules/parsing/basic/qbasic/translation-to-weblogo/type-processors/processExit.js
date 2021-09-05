import { isInFunction } from
'../../parsing/parse-tree-analysis/variable-data-types/isInFunction.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

export function processExit(token, result, options) {
	const child = token.children[0];
	if (child !== undefined) {
		if (child.type === ParseTreeTokenType.SUB ||
		child.type === ParseTreeTokenType.FUNCTION) {
			result.append('stop');
		}
	}
	if (isInFunction(token)) {
		result.append('stop');
	}
};