import { isAcceptableInstructionListChild } from '../../../../parsing/parse-tree-analysis/isAcceptableInstructionListChild.js';
import { isInstructionList } from '../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

// token is assumed to be a CURVED_BRACKET_EXPRESSION.
function isOfInterest(token) {
	if (token.children.length !== 3 || !isInstructionList(token.parentNode))
		return false;
	if (isAcceptableInstructionListChild(token))
		return false;
	while (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	token.children.length === 3)
		token = token.children[1];
	return token.type === ParseTreeTokenType.PARAMETERIZED_GROUP;
}

export function curvedBracketFixer(cachedParseTree, fixLogger) {
	// find curved bracket expressions that need fixing.
	const expressionTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.CURVED_BRACKET_EXPRESSION).
	filter(isOfInterest);
	expressionTokens.forEach(function(expressionToken) {
		let child;
		let expressionToken2 = expressionToken;
		const instructionListToken = expressionToken.parentNode;
		do {
			const openBracket = expressionToken2.children[0];
			child = expressionToken2.children[1];
			const closeBracket = expressionToken2.children[2];
			child.remove();
			cachedParseTree.tokensRemoved([openBracket, expressionToken2, closeBracket]);
			expressionToken2 = child;
		} while (child.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
		instructionListToken.replaceChild(expressionToken, child);
		fixLogger.log(`Removed needless ( curved brackets ) around instruction`, expressionToken);
	});
};