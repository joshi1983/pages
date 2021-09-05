import { CommandCalls } from
'../../../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { getDescendentsOfType } from
'../../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	if (!CommandCalls.tokenMatchesPrimaryName(token, 'forever') ||
	token.children.length !== 1)
		return false;
	
	const instructionList = token.children[0];

	// the break must be a direct child of the forever's instruction list
	const directChildBreaks = instructionList.children.filter(t => CommandCalls.tokenMatchesPrimaryName(t, 'break'));
	if (directChildBreaks.length !== 1)
		return false;

	// deeper nested break calls would likely lead to errors if the forever gets removed.
	// if a deeper break is found, avoid this fix.
	if (getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP).
		some(t => t.parentNode !== instructionList && CommandCalls.tokenMatchesPrimaryName(t, 'break')))
		return false;

	return true;
};

export function simplifyForeverBreak(cachedParseTree, fixLogger) {
	const forevers = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	forevers.forEach(function(forever) {
		const instructionList = forever.children[0];
		const firstBracket = instructionList.children[0];
		const lastBracket = instructionList.children[instructionList.children.length - 1];
		const breakToken = instructionList.children.filter(t => CommandCalls.tokenMatchesPrimaryName(t, 'break'))[0];
		const toRemove = [breakToken, forever, instructionList];
		if (firstBracket.isBracket()) {
			firstBracket.remove();
			toRemove.push(firstBracket);
		}
		if (lastBracket.isBracket()) {
			lastBracket.remove();
			toRemove.push(lastBracket);
		}
		breakToken.remove();
		instructionList.removeSingleToken();
		forever.removeSingleToken();
		cachedParseTree.tokensRemoved(toRemove);
		fixLogger.log(`Removed forever loop that always breaked because the forever and break were redundant.`,  forever);
	});
	return forevers.length !== 0;
};