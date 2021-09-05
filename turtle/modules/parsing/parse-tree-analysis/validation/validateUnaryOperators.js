import { getTokensByType } from
'../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(token) {
	return token.children.length !== 1;
}

export function validateUnaryOperators(cachedParseTree, parseLogger) {
	const unaryOperators = getTokensByType(cachedParseTree, ParseTreeTokenType.UNARY_OPERATOR).
		filter(isOfInterest);
	unaryOperators.forEach(function(unaryOperatorToken) {
		parseLogger.error(`1 operand is expected for unary operator ${unaryOperatorToken.val} but found ${unaryOperatorToken.children.length}`, unaryOperatorToken);
	});
};