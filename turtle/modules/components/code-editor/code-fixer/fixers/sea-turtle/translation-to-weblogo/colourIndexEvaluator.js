import { CachedParseTree } from
'../../../../../../parsing/parse-tree-analysis/CachedParseTree.js';
import { Command } from
'../../../../../../parsing/Command.js';
import { getAllDescendentsAsArray } from
'../../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';
import { SeaTurtleColours } from
'../SeaTurtleColours.js';

const childTypesOfInterest = new Set([
	ParseTreeTokenType.BINARY_OPERATOR
]);

function isOfInterest(token) {
	const children = token.children;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined || children.length !== 1)
		return false;

	const primaryName = info.primaryName;
	if (primaryName !== 'setScreenColor' && primaryName !== 'setPenColor')
		return false;
	
	const firstChild = children[0];
	return childTypesOfInterest.has(firstChild.type);
}

export function colourIndexEvaluator(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	if (tokens.length !== 0) {
		const readCachedParseTree = new CachedParseTree(cachedParseTree.root,
			cachedParseTree.getProceduresMap(), new Map());
		const tokenValuesMap = readCachedParseTree.getTokenValues();
		tokens.forEach(function(call) {
			const childToken = call.children[0];
			const childVal = tokenValuesMap.get(childToken);
			const colourInfo = SeaTurtleColours.getColourInfo('' + childVal);
			if (colourInfo !== undefined) {
				const tokensToRemove = getAllDescendentsAsArray(childToken);
				childToken.removeAllChildren();
				const oldType = childToken.type;
				childToken.type = ParseTreeTokenType.STRING_LITERAL;
				childToken.val = colourInfo.name;
				cachedParseTree.tokenTypeChanged(childToken, oldType);
				cachedParseTree.tokensRemoved(tokensToRemove);
				fixLogger.log(`Replaced ${childVal} with ${childToken.val} because that is WebLogo's equivalent color name`, childToken);
			}
		});
	}
};