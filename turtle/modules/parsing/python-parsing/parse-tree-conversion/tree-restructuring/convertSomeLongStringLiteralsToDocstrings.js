import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const docstringParentTypes = new Set([
	ParseTreeTokenType.FUNCTION_DEFINITION,
	ParseTreeTokenType.UNRECOGNIZED
]);

function isOfInterest(token) {
	if (token.type !== ParseTreeTokenType.LONG_STRING_LITERAL ||
	!docstringParentTypes.has(token.parentNode.type))
		return false;
	if (token.parentNode.type !== ParseTreeTokenType.FUNCTION_DEFINITION) {
		/* A docstring must be the first child of its parent */
		if (token.parentNode.children.indexOf(token) !== 0)
			return false;
	}
	return true;
}

export function convertSomeLongStringLiteralsToDocstrings(token) {
	if (isOfInterest(token)) {
		token.type = ParseTreeTokenType.DOCSTRING;
		return true;
	}
	else {
		let result = false;
		if (convertChildren(token, convertSomeLongStringLiteralsToDocstrings))
			result = true;
		return result;
	}
};