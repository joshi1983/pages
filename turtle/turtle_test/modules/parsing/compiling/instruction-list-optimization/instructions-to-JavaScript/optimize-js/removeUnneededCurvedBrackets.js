import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { getDescendentsOfType } from '../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { parse } from '../../../../js-parsing/parse.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';
import { parseTreeTokensToCode } from '../../../../js-parsing/parseTreeTokensToCode.js';

const interestingTypes = new Set([
ParseTreeTokenType.ARRAY_LITERAL,
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.EXPRESSION_DOT,
ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
ParseTreeTokenType.FUNCTION_CALL,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.REGULAR_EXPRESSION_LITERAL,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.TEMPLATE_LITERAL
]);
const parentTypesExpectingCurvedBracketsInChildren = new Set([
ParseTreeTokenType.IF,
ParseTreeTokenType.SWITCH,
ParseTreeTokenType.WHILE,
]);

function isOfInterest(token) {
	const parent = token.parentNode;
	if (parentTypesExpectingCurvedBracketsInChildren.has(parent.type))
		return false;
	if (token.children.length === 3 && token.children[0].type === ParseTreeTokenType.CURVED_LEFT_BRACKET &&
	token.children[token.children.length - 1].type === ParseTreeTokenType.CURVED_RIGHT_BRACKET) {
		const wrappedToken = token.children[1];
		if (interestingTypes.has(wrappedToken.type))
			return true;
		if (wrappedToken.children.length === 0)
			return true;
	}

	return false;
}

export function removeUnneededCurvedBrackets(jsCode) {
	const parseResult = parse(jsCode);
	const curvedBracketExpressions = getDescendentsOfType(parseResult.root, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION).
	filter(isOfInterest);
	curvedBracketExpressions.forEach(function(token) {
		const wrappedToken = token.children[1];
		token.parentNode.replaceChild(token, wrappedToken);
	});
	const allTokens = flatten(parseResult.root);
	return parseTreeTokensToCode(allTokens);
};