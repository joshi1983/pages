import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
const colourCommandNames = new Set(['color', 'colour']);

function isOfInterest(token) {
	if (!colourCommandNames.has(token.val.toLowerCase()))
		return false;
	const next = token.nextSibling;
	if (next === null || next.type !== ParseTreeTokenType.LIST ||
	next.children.length < 5)
		return false;
	return true;
};

export function colorCallWithDataListFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(isOfInterest);
	tokens.forEach(function(colorCallToken) {
		const oldVal = colorCallToken.val;
		const next = colorCallToken.nextSibling;
		colorCallToken.val = 'setPenColor';
		colorCallToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		cachedParseTree.tokenTypeChanged(colorCallToken, ParseTreeTokenType.LEAF);
		next.remove();
		colorCallToken.appendChild(next);
		fixLogger.log(`Replaced call to ${oldVal} with setPenColor because that is how you set the pen color in WebLogo`, colorCallToken);
	});
};