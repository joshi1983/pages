import { addToken } from './addToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CONDITIONAL_TERNARY,
	ParseTreeTokenType.DEFAULT,
	ParseTreeTokenType.TREE_ROOT
]);
const pairTypes = new Set([
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TEMPLATE_LITERAL,
]);
const ternaryCheckTypesToSkip = new Set([
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.IDENTIFIER,
]);
SetUtils.addAll(goodPreviousTypes, pairTypes);

function isGoodPrevious(token) {
	if (token.parentNode !== null) {
		if (pairTypes.has(token.type) &&
		token.parentNode.type === ParseTreeTokenType.CONDITIONAL_TERNARY)
			return false;
		if (token.parentNode.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION &&
		pairTypes.has(token.type))
			return true;
		if (token.type === ParseTreeTokenType.IDENTIFIER &&
		token.parentNode.type !== ParseTreeTokenType.CURLY_BRACKET_EXPRESSION)
			return false;
	}
	if (goodPreviousTypes.has(token.type))
		return true;
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;

	return token;
}

function isInTernary(token) {
	while (ternaryCheckTypesToSkip.has(token.type))
		token = token.parentNode;
	if (token.type === ParseTreeTokenType.CONDITIONAL_TERNARY)
		return true;
	if (token.parentNode !== null &&
	token.parentNode.type === ParseTreeTokenType.CONDITIONAL_TERNARY)
		return true;
	return false;
}

function shouldTreatAsPair(token) {
	if (isInTernary(token))
		return false;
	if (token.type !== ParseTreeTokenType.CURLY_BRACKET_EXPRESSION &&
	token.parentNode !== null &&
	token.parentNode.type !== ParseTreeTokenType.CURLY_BRACKET_EXPRESSION)
		return false;
	return pairTypes.has(token.type);
}

export function processColon(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	if (shouldTreatAsPair(previousToken)) {
		const prevParent = previousToken.parentNode;
		prevParent.appendChild(nextToken);
		previousToken.remove();
		nextToken.appendChild(previousToken);
		return nextToken;
	}
	else if (previousToken.type === ParseTreeTokenType.CONDITIONAL_TERNARY)
		previousToken.appendChild(nextToken);
	else
		addToken(previousToken, nextToken);
};