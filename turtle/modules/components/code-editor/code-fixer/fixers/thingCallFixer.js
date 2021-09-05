import { getSortedFirstDescendentTokenOf } from '../../../../parsing/generic-parsing-utilities/getSortedFirstDescendentTokenOf.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { validateIdentifier } from '../../../../parsing/parse-tree-analysis/validateIdentifier.js';

const typesForTokensBeforeAllDescendents = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.LEAF,
	ParseTreeTokenType.LIST,
	ParseTreeTokenType.LONG_STRING_LITERAL,
	ParseTreeTokenType.PARAMETERIZED_GROUP,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR,
	ParseTreeTokenType.VARIABLE_READ
]);

function getAncestorOfNextSibling(token) {
	if (token.nextSibling !== null)
		return null;
	while (token.nextSibling === null && token.parentNode !== null)
		token = token.parentNode;
	return token.nextSibling;
}

function getTokenAfter(token) {
	if (token.nextSibling !== null)
		return token.nextSibling;
	const nextSibling = getAncestorOfNextSibling(token);
	if (nextSibling === null)
		return null;
	if (typesForTokensBeforeAllDescendents.has(nextSibling.type) || nextSibling.children.length === 0)
		return nextSibling;
	if (nextSibling.type === ParseTreeTokenType.BINARY_OPERATOR)
		return getSortedFirstDescendentTokenOf(nextSibling);
	return null;
}

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'thing')
		return false;
	const varNameToken = getTokenAfter(token);
	if (varNameToken === null || !varNameToken.isStringLiteral())
		return false;
	if (validateIdentifier(varNameToken.val) !== undefined)
		return false;
	return true;
}

export function thingCallFixer(cachedParseTree, fixLogger) {
	const callTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	callTokens.forEach(function(thingToken) {
		const varNameToken = getTokenAfter(thingToken);
		const varNameTokenAncestor = getAncestorOfNextSibling(thingToken);
		const varNameTokenParent = varNameToken.parentNode;
		if (varNameTokenAncestor !== null && varNameTokenAncestor.type === ParseTreeTokenType.BINARY_OPERATOR) {
			if (thingToken.parentNode !== null) {
				varNameTokenAncestor.remove();
				thingToken.parentNode.replaceChild(thingToken, varNameTokenAncestor);
				thingToken.remove();
				varNameTokenParent.replaceChild(varNameToken, thingToken);
			}
			else {
				varNameTokenParent.replaceChild(varNameToken, thingToken);
			}
		}
		else {
			varNameToken.remove();
		}
		thingToken.type = ParseTreeTokenType.VARIABLE_READ;
		const oldVal = thingToken.val;
		thingToken.val = varNameToken.val;
		cachedParseTree.tokenRemoved(varNameToken);
		cachedParseTree.tokenTypeChanged(thingToken, ParseTreeTokenType.LEAF);
		cachedParseTree.tokenValueChanged(thingToken, oldVal);
		fixLogger.log(`Replaced call to thing command with more conventional variable read because the thing command is not supported by WebLogo`, thingToken);
	});
};