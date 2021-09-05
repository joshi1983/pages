import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	if (token.val !== 'if' || token.children.length !== 2)
		return false;
	const nextSibling = token.nextSibling;
	if (nextSibling === null || nextSibling.val !== 'else' ||
	nextSibling.type !== ParseTreeTokenType.LEAF)
		return false;
	const nextNextSibling = nextSibling.nextSibling;
	if (nextNextSibling === null || nextNextSibling.val !== null)
		return false;
	return true;
}

/*
There is an ifElseFixer for fixing if-else statements from other Logo interpreters.
This one is specific to the format used in Logo 3D.
*/
export function ifElseStatementFixer(cachedParseTree, fixLogger) {
	const ifsOfInterest = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	const removed = [];
	ifsOfInterest.forEach(function(ifToken) {
		const elseToken = ifToken.nextSibling;
		const elseInstructionsToken = elseToken.nextSibling;
		const oldVal = ifToken.val;
		ifToken.val = 'ifElse';
		elseToken.remove();
		elseInstructionsToken.remove();
		ifToken.appendChild(elseInstructionsToken);
		removed.push(elseToken);
		cachedParseTree.tokenValueChanged(ifToken, oldVal);
		fixLogger.log(`Replaced if .. [..] else [..] with ifElse because ifElse is the similar command supported by WebLogo`, ifToken);
	});
	cachedParseTree.tokensRemoved(removed);
};