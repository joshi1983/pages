import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	const prev = token.previousSibling;
	if (prev === null || prev.type !== ParseTreeTokenType.LEAF || prev.val.toLowerCase() !== 'else')
		return false;
	const prevPrev = prev.previousSibling;
	if (prevPrev === null || prevPrev.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;

	return true;
}

function replaceBracketsIfNeeded(cachedParseTree, token, fixLogger) {
	token.type = ParseTreeTokenType.LIST;
	const children = token.children;
	const firstChild = children[0];
	const lastChild = children[children.length - 1];
	firstChild.val = '[';
	if (lastChild.val === ')')
		lastChild.val = ']';

	cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
	fixLogger.log(`After an else, replaced () brackets with square brackets [] because square brackets should surround all instruction lists in WebLogo`, token);
}

export function elseCurvedBracketFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.CURVED_BRACKET_EXPRESSION).
		filter(isOfInterest);
	tokens.forEach(function(token) {
		const prev = token.previousSibling;
		let ifToken;
		if (prev.type === ParseTreeTokenType.LEAF && prev.val.toLowerCase() === 'else') {
			ifToken = prev.previousSibling;
			prev.remove();
			cachedParseTree.tokenRemoved(prev);
		}
		else
			ifToken = prev;
		if (ifToken.val.toLowerCase() === 'if') {
			ifToken.val = 'ifelse';
			replaceBracketsIfNeeded(cachedParseTree, ifToken.children[1], fixLogger);
			token.remove();
			ifToken.appendChild(token);
		}
		replaceBracketsIfNeeded(cachedParseTree, token, fixLogger);
	});

	return tokens.length !== 0;
};