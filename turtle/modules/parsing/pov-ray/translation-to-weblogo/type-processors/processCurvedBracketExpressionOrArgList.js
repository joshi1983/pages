import { filterOutBrackets } from './helpers/filterOutBrackets.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processTokens } from './processTokens.js';

const parentTypesNotNeedingBrackets = new Set([
	ParseTreeTokenType.IF,
	ParseTreeTokenType.WHILE
]);

function areBracketsNeeded(token) {
	const parent = token.parentNode;
	if (parent === null)
		return true;
	if (token.type === ParseTreeTokenType.ARG_LIST)
		return false;
	if (token.children.length > 3)
		// weird number of children so return true to be safe.
		return true;
	return !parentTypesNotNeedingBrackets.has(parent.type);
}

export function processCurvedBracketExpressionOrArgList(token, result) {
	if (token.children.length > 2) {
		let children = token.children;
		if (!areBracketsNeeded(token))
			children = filterOutBrackets(children);
		processTokens(children, result);
	}
	else {
		result.append(`; Failed to translate curved bracket expression because there were too few child tokens\n`);
	}
};