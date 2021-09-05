import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';

function isGotoCallOfInterest(token) {
	if (token.val.toLowerCase() !== 'goto')
		return false;
	const next = token.nextSibling;
	if (next === null || next.type !== ParseTreeTokenType.LEAF)
		return false;
	return true;
}

function isUnusedMark(cachedParseTree) {
	const gotos = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isGotoCallOfInterest);
	const usedMarkNames = new Set(gotos.map(t => t.nextSibling.val));
	return function(token) {
		const val = token.val.toLowerCase();
		if (val !== 'mark' && val !== 'omark')
			return false;
		const next = token.nextSibling;
		if (next === null || next.type !== ParseTreeTokenType.LEAF || usedMarkNames.has(next.val.toLowerCase()))
			return false;
		return true;
	};
}

export function removeUnusedMarkCalls(cachedParseTree, fixLogger) {
	const unusedMarks = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isUnusedMark(cachedParseTree));
	const removed = [];
	unusedMarks.forEach(function(markToken) {
		const nameToken = markToken.nextSibling;
		markToken.remove();
		nameToken.remove();
		removed.push(markToken, nameToken);
		fixLogger.log(`Removed call to ${markToken.val} because ${nameToken.val} is not used by any goto statement.`, markToken);
	});
	cachedParseTree.tokensRemoved(removed);
};