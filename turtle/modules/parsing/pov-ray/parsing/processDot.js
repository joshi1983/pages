import { createKeyValuePair } from './createKeyValuePair.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (goodPreviousTypes.has(token.type))
		return true;
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

function isKeyValuePairNeeded(prev) {
	if (prev.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION)
		return true;
	return false;
}

function isExpressionDotExpressionNeeded(prev) {
	if (prev.parentNode === null)
		return false;
	if (prev.type === ParseTreeTokenType.IDENTIFIER)
		return true;
	return false;
}

export function processDot(prev, next) {
	prev = getGoodPrevious(prev);
	if (isKeyValuePairNeeded(prev)) {
		const pair = createKeyValuePair(prev, next, false);
		const dotProperty = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.DOT_PROPERTY);
		pair.appendChild(dotProperty);
		prev = dotProperty;
	}
	else if (isExpressionDotExpressionNeeded(prev)) {
		const eDotProperty = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.EXPRESSION_DOT_PROPERTY);
		const prevParent = prev.parentNode;
		const identifier = prev;
		prevParent.appendChild(eDotProperty);
		eDotProperty.appendChild(identifier);
		prev = eDotProperty;
	}
	prev.appendChild(next);
	return next;
};