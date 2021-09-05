import { CommandCalls } from
'../../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { getSortedLastDescendentTokenOf } from
'../../../../../parsing/generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'beginpath')
		return false;
	const next = token.nextSibling;
	if (next === null || next.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	return CommandCalls.tokenMatchesPrimaryName(next, 'setPos');
}

function moveSetPos(beginPathToken, cachedParseTree) {
	const next = beginPathToken.nextSibling;
	const nextLastDescendent = getSortedLastDescendentTokenOf(next);
	beginPathToken.lineIndex = nextLastDescendent.lineIndex;
	beginPathToken.colIndex = 1 + nextLastDescendent.colIndex;
	beginPathToken.remove();
	next.appendSibling(beginPathToken);
}

export function setPosBeforeBeginPathFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	tokens.forEach(function(beginpathToken) {
		moveSetPos(beginpathToken, cachedParseTree);
		fixLogger.log(`Moved setPos before beginpath because WebLogo handles setPos differently with respect to paths than some Logo variants that have a beginpath command.`, beginpathToken);
	});
};