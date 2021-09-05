import { insertColIndexSpanAt } from
'../../../../../parsing/generic-parsing-utilities/insertColIndexSpanAt.js';
import { ParseTreeToken } from
'../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	const parent = token.parentNode;
	if (parent === null || parent.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return false;
	if (parent.children.length < 3)
		return false;
	if (!token.originalString.startsWith('+'))
		return false;
	const prev = token.previousSibling;
	if (prev === null || prev.isBracket())
		return false;
	return true;
}

export function plusNumberLiteralFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.NUMBER_LITERAL).
		filter(isOfInterest);
	tokens.forEach(function(numberToken) {
		const prev = numberToken.previousSibling;
		const parent = numberToken.parentNode;
		const plusOperator = new ParseTreeToken('+', null, numberToken.lineIndex, 
			numberToken.colIndex - numberToken.originalString.length + 1,
			ParseTreeTokenType.BINARY_OPERATOR);
		numberToken.originalString = numberToken.originalString.substring(1);
		prev.remove();
		insertColIndexSpanAt(numberToken, 1);
		numberToken.colIndex++;
		plusOperator.appendChild(prev);
		parent.replaceChild(numberToken, plusOperator);
		numberToken.remove();
		plusOperator.appendChild(numberToken);
		cachedParseTree.tokenAdded(plusOperator);
		fixLogger.log(`Inserted space after + because WebLogo needs that to recognize the + as a binary operator.`, numberToken);
	});
};