import { CachedParseTree } from
'../../../../../../parsing/parse-tree-analysis/CachedParseTree.js';
import { Command } from
'../../../../../../parsing/Command.js';
import { evaluateTokensBasic } from
'../../../../../../parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { getAllDescendentsAsArray } from
'../../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { isNumber } from
'../../../../../../isNumber.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';
import { valueToLiteralCode } from
'../../../../../../valueToLiteralCode.js';

const typesOfInterest = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.PARAMETERIZED_GROUP,
	ParseTreeTokenType.UNARY_OPERATOR
]);

function isBinaryOperatorOfInterest(token) {
	if (token.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	token.children.length !== 2)
		return false;
	return true;
}

function isParameterizedGroupOfInterest(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined || info.returnTypes === null)
		return false;
	return true;
}

function isOfInterestLoose(token) {
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR)
		return isBinaryOperatorOfInterest(token);
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
		return isParameterizedGroupOfInterest(token);
	return true;
}

function isOfInterestStrict(token) {
	if (!typesOfInterest.has(token.type))
		return false;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
		return isParameterizedGroupOfInterest(token);
	return true;
}

function replaceWithLiteral(token, newVal, cachedParseTree) {
	if (isNumber(newVal) || typeof newVal === 'string') {
		const descendents = getAllDescendentsAsArray(token);
		token.removeAllChildren();
		cachedParseTree.tokensRemoved(descendents);
	}
	const oldType = token.type;
	if (isNumber(newVal)) {
		
		token.type = ParseTreeTokenType.NUMBER_LITERAL;
		token.val = newVal;
		token.originalString = '' + newVal;
	}
	else if (typeof newVal === 'string') {
		token.val = newVal;
		token.originalString = valueToLiteralCode(newVal);
		if (token.originalString[0] === '"')
			token.type = ParseTreeTokenType.STRING_LITERAL;
		else
			token.type = ParseTreeTokenType.LONG_STRING_LITERAL;
	}
	if (oldType !== token.type)
		cachedParseTree.tokenTypeChanged(token, oldType);
}

export function simplifyWithLiterals(cachedParseTree, fixLogger) {
	const tokensLooselyFiltered = cachedParseTree.getTokensByTypes([
			ParseTreeTokenType.BINARY_OPERATOR,
			ParseTreeTokenType.PARAMETERIZED_GROUP
		]).filter(isOfInterestLoose);
	if (tokensLooselyFiltered.length !== 0) {
		const readOptimizedCachedParseTree = new CachedParseTree(cachedParseTree.root, new Map(), new Map());
		const tokenValuesMap = evaluateTokensBasic(readOptimizedCachedParseTree);
		let tokens = Array.from(tokenValuesMap.keys()).filter(isOfInterestStrict);
		let result = false;
		tokens.forEach(function(token) {
			const parent = token.parentNode;
			if (parent === null)
				return; // if token was already removed, don't process it.

			const parentVal = tokenValuesMap.get(parent);
			if (parentVal !== undefined && parentVal !== null && isOfInterestStrict(parent))
				return; // if an ancestor is evaluated, let it handle this one.

			const newVal = tokenValuesMap.get(token);
			if (newVal === null || newVal === undefined)
				return;

			replaceWithLiteral(token, newVal, cachedParseTree);
			fixLogger.log(`Simplified a token to a literal because an expression could be evaluated`, token);
			result = true;
		});
		return result;
	}
	return false;
};