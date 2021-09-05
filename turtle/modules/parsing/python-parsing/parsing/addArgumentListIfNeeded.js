import { createTokenFromToken } from './createTokenFromToken.js';
import { getStartingLineIndex } from './getStartingLineIndex.js';
import { isDataValueTokenType } from './mightBeDataValueToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { willBecomePrintFunctionCall } from './willBecomePrintFunctionCall.js';

const nextTokenTypesOfInterest = new Set([
	ParseTreeTokenType.CURVED_LEFT_BRACKET
]);

function shouldCreateArgList(prev, next) {
	if (prev.children.length !== 0)
		return false;
	if (willBecomePrintFunctionCall(prev) &&
	next.type === ParseTreeTokenType.SQUARE_LEFT_BRACKET)
		return true;
	if (!isDataValueTokenType(next.type) &&
	!nextTokenTypesOfInterest.has(next.type))
		return false;
	if (prev.type === ParseTreeTokenType.IDENTIFIER ||
	prev.type === ParseTreeTokenType.FUNCTION_CALL ||
	prev.type === ParseTreeTokenType.DECORATOR) {
		if (next.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET) {
			return getStartingLineIndex(next) >= prev.lineIndex &&
				prev.val === 'print';
		}
		return true;
	}
	return false;
}

function shouldPrevBecomeFunctionCall(prev) {
	if (prev.type === ParseTreeTokenType.FUNCTION_DEFINITION ||
	prev.type === ParseTreeTokenType.DECORATOR)
		return false;

	return true;
}

function getGoodPreviousForArgList(prev) {
	const parent = prev.parentNode;
	if (parent.type === ParseTreeTokenType.FUNCTION_DEFINITION)
		return parent;
	return prev;
}

export function addArgumentListIfNeeded(prev, next) {
	if (shouldCreateArgList(prev, next)) {
		prev = getGoodPreviousForArgList(prev);
		const argList = createTokenFromToken(null, next, ParseTreeTokenType.ARGUMENT_LIST);
		if (shouldPrevBecomeFunctionCall(prev))
			prev.type = ParseTreeTokenType.FUNCTION_CALL;
		prev.appendChild(argList);
		prev = argList;
	}
	return prev;
};