import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
import { wrapInList } from '../helpers/wrapInList.js';

function isOfInterest(token) {
	const children = token.children;
	if (token.val.toLowerCase() !== 'if' ||
	token.children.length < 2)
		return false;
	const instructionList = children[1];
	if (instructionList.type === ParseTreeTokenType.LIST)
		return false; // no problem to fix.
	if (instructionList.type === ParseTreeTokenType.LEAF &&
	instructionList.val.toLowerCase() === 'then')
		return false; // the thenFixer should fix this kind of problem instead.
	return true;
}

export function ifInstructionListFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	tokens.forEach(function(token) {
		const instructionToken = token.children[1];
		wrapInList(instructionToken, cachedParseTree);
		fixLogger.log(`Added square brackets around instruction list because they are required by WebLogo to mark the start and end of each instruction list.`, token);
	});
};