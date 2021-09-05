import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';

const unaryOperatorsOfInterest = new Set([
	'-'
]);

function isOfInterest(token) {
	if (!unaryOperatorsOfInterest.has(token.val) ||
	token.children.length !== 1)
		return false;

	const firstChild = token.children[0];
	if (firstChild.val !== token.val ||
	firstChild.type !== ParseTreeTokenType.UNARY_OPERATOR) {
		return false;
	}
	return true;
}

export function simplifyUnaryOperators(cachedParseTree, fixLogger) {
	const ops = cachedParseTree.getTokensByType(ParseTreeTokenType.UNARY_OPERATOR).
		filter(isOfInterest);
	ops.forEach(function(opToken) {
		if (opToken.children.length === 1) {
			const toRemove = [opToken.children[0], opToken];
			for (const token of toRemove) {
				token.removeSingleToken();
			}
			cachedParseTree.tokensRemoved(toRemove);
			fixLogger.log(`Removed 2 ${opToken.val} operators because they cancel each other out.  Removing them simplifies the code.`,  opToken);
		}
	});
	return ops.length !== 0;
};