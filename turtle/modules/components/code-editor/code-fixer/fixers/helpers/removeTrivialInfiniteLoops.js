import { getAllDescendentsAsArray } from
'../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getTokensByType } from
'../../../../../parsing/generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'forever')
		return false;

	const instructionListToken = token.children[0];
	if (instructionListToken === undefined)
		return false;

	const children = instructionListToken.children.filter(c => !c.isBracket());
	return children.length === 0;
}

export function removeTrivialInfiniteLoops(cachedParseTree, fixLogger) {
	const loopTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	loopTokens.forEach(function(loopToken) {
		const allTokens = getAllDescendentsAsArray(loopToken);
		loopToken.remove();
		allTokens.push(loopToken);
		cachedParseTree.tokensRemoved(allTokens);
		fixLogger.log(`Removed infinite loop because does nothing important other than keep the program running`, loopToken);
	});
	return loopTokens.length !== 0;
};