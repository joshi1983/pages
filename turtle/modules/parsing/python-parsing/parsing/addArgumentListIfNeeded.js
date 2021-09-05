import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nextTokenTypesOfInterest = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.BYTES_LITERAL,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NONE,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
]);

function shouldCreateArgList(prev, next) {
	if (prev.children.length !== 0)
		return false;
	if (!nextTokenTypesOfInterest.has(next.type))
		return false;
	if (prev.type === ParseTreeTokenType.IDENTIFIER ||
	prev.type === ParseTreeTokenType.FUNCTION_CALL ||
	prev.type === ParseTreeTokenType.PRINT) {
		if (next.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET) {
			return next.lineIndex === prev.lineIndex &&
				prev.val === 'print';
		}
		return true;
	}
	return false;
}

function shouldPrevBecomeFunctionCall(prev) {
	if (prev.type === ParseTreeTokenType.PRINT ||
	prev.type === ParseTreeTokenType.FUNCTION_DEFINITION)
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
		const argList = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.ARGUMENT_LIST);
		if (shouldPrevBecomeFunctionCall(prev))
			prev.type = ParseTreeTokenType.FUNCTION_CALL;
		prev.appendChild(argList);
		prev = argList;
	}
	return prev;
};