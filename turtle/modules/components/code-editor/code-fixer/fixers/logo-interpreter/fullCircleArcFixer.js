import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'arc')
		return false;
	if (token.children.length !== 2)
		return false;
	const angleToken = token.children[0];
	if (angleToken.type !== ParseTreeTokenType.NUMBER_LITERAL)
		return false;
	if (angleToken.val !== 360)
		return false;
	return true;
}

export function fullCircleArcFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	const toRemove = [];
	tokens.forEach(function(arcToken) {
		const angleToken = arcToken.children[0];
		arcToken.val = 'circle';
		angleToken.remove();
		toRemove.push(angleToken);
		fixLogger.log(`Replaced arc 360 ... with circle ... because some other versions of Logo treat arc 360 similar to circle.`, arcToken);
	});
	cachedParseTree.tokensRemoved(toRemove);
};