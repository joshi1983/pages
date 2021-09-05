import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'run')
		return false;
	const next = token.nextSibling;
	if (next === null || next.type !== ParseTreeTokenType.LIST ||
	next.children.length < 2)
		return false;
	return true;
}

function processRunCall(runCall, cachedParseTree) {
	const instructionList = runCall.nextSibling;
	const toRemove = [runCall, instructionList];
	runCall.remove();
	while (instructionList.children.length !== 0) {
		const first = instructionList.children[0];
		const removed = first.isBracket();
		if (removed)
			toRemove.push(first);
		if (first.parentNode === null)
			console.log(`Weird. first has no parentNode. first=${first.toString()}`);
		first.remove();
		if (!removed)
			instructionList.appendPreviousSibling(first);
	}
	toRemove.forEach(t => { if (t.parentNode !== null) t.remove(); });
	cachedParseTree.tokensRemoved(toRemove);
};

export function runFixer(cachedParseTree, fixLogger) {
	const runs = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	runs.forEach(function(runCall) {
		processRunCall(runCall, cachedParseTree);
		fixLogger.log(`Removed run and square brackets because WebLogo does not support run.`, runCall);
	});
};