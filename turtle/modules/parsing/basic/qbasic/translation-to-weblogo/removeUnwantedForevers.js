import { Command } from
'../../../Command.js';
import { isLoop } from
'../../../parse-tree-analysis/isLoop.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const breakNames = Command.getLowerCaseCommandNameSet('break');

function containsApplicableBreak(children) {
	for (const t of children) {
		if (t.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			if (breakNames.has(t.val.toLowerCase())) {
				return true;
			}
			if (isLoop(t))
				continue;
		}
		if (containsApplicableBreak(t.children))
			return true;
	}
	return false;
}

function isOfInterest(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP ||
	token.children.length !== 1)
		return false;

	const info = Command.getCommandInfo(token.val);
	if (info === undefined || info.primaryName !== 'forever')
		return false;

	if (containsApplicableBreak(token.children))
		return false; // Only infinite forever loops are of interest.

	return true;
}

export function removeUnwantedForevers(cachedParseTree, fixLogger) {
	const forevers = cachedParseTree.root.children.
		filter(isOfInterest);
	forevers.forEach(function(forever) {
		const codeBlock = forever.children[0];
		const toRemove = [codeBlock, forever];
		for (const c of codeBlock.children) {
			if (c.isBracket())
				toRemove.push(c);
		}
		for (const t of toRemove) {
			t.removeSingleToken();
		}
		cachedParseTree.tokensRemoved(toRemove);
		fixLogger.log(`Removed forever loop because it looked unwanted in the corresponding WebLogo program`, forever);
	});
	return forevers.length !== 0;
};