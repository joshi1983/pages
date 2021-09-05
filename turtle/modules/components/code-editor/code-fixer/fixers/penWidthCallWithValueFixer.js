import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

const widthValueTokenTypes = new Set([
ParseTreeTokenType.BINARY_OPERATOR,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.UNARY_OPERATOR,
ParseTreeTokenType.VARIABLE_READ
]);

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'penwidth')
		return false;
	const next = token.nextSibling;
	if (next === null || !widthValueTokenTypes.has(next.type))
		return false;
	return true;
};

export function penWidthCallWithValueFixer(cachedParseTree, fixLogger) {
	const penwidthCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(isOfInterest);
	penwidthCalls.forEach(function(callToken) {
		const oldVal = callToken.val;
		callToken.val = 'setPenSize';
		callToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		const next = callToken.nextSibling;
		next.remove();
		callToken.appendChild(next);
		cachedParseTree.tokenTypeChanged(callToken, ParseTreeTokenType.LEAF);
		fixLogger.log(`Replaced ${oldVal} with setPenSize because that is how you set the pen size or width in WebLogo`, callToken);
	});
};