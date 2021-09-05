import { convertToFunctionCallWithFirstArgToken } from
'./convertToFunctionCallWithFirstArgToken.js';
import { getSortedLastDescendentTokenOf } from
'../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const parentTypesBlockingConvertToFunctionCall = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.FUNCTION_CALL,
]);

function getLastDescendent(token) {
	return getSortedLastDescendentTokenOf(token);
}

function shouldConvertToFunctionCall(prev, next) {
	const token = getLastDescendent(prev);
	if (token.lineIndex !== next.lineIndex)
		return false; // QBasic usually has arguments on the 
		//same line as the function name in a function call.

	if (token.type !== ParseTreeTokenType.IDENTIFIER ||
	token.children.length !== 0)
		return false;
	const parent = token.parentNode;
	if (parentTypesBlockingConvertToFunctionCall.has(parent.type))
		return false;
	return true;
}

export function processNumberLiteral(prev, next, functionsMap) {
	if (shouldConvertToFunctionCall(prev, next)) {
		return convertToFunctionCallWithFirstArgToken(getLastDescendent(prev), next, functionsMap);
	}
	prev.appendChild(next);
	return prev;
};