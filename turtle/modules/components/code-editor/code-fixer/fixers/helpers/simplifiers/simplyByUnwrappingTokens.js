import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';
import { unwrapCurvedBracketExpressions } from
'./unwrapCurvedBracketExpressions.js';

function isOfInterest(token) {
	const unwrappedToken = unwrapCurvedBracketExpressions(token);
	if (unwrappedToken === token)
		return false;

	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	token === unwrappedToken.parentNode)
		return false;

	return true;
}

function getTokensToRemove(token, unwrappedToken, result) {
	if (result === undefined)
		result = [];
	if (token !== unwrappedToken) {
		result.push(token);
		for (const child of token.children) {
			getTokensToRemove(child, unwrappedToken, result)
		}
	}
	return result;
}

export function simplyByUnwrappingTokens(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getAllTokens().
		filter(isOfInterest);
	tokens.forEach(function(token) {
		const unwrappedToken = unwrapCurvedBracketExpressions(token);
		const tokensToRemove = getTokensToRemove(token, unwrappedToken);
		cachedParseTree.tokensRemoved(tokensToRemove);
		token.parentNode.replaceChild(token, unwrappedToken);
		let msg = 'Simplified part of an expression';
		if (token.val !== null)
			msg = `Removed a ${token.val} because it could be simplified more.`;
		fixLogger.log(msg, token);
	});

	return tokens.length !== 0;
};