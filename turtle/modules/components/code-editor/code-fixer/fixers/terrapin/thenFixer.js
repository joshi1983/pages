import { getNextArgToken } from
'../helpers/getNextArgToken.js';
import  { getSortedLastDescendentTokenOf } from
'../../../../../parsing/generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeToken } from
'../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isIfToken(token) {
	return token !== null &&
	token.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
	token.val.toLowerCase() === 'if';
}

function thenTokenToIf(thenToken) {
	const prev = thenToken.previousSibling;
	if (isIfToken(prev))
		return prev;
	const parent = thenToken.parentNode;
	if (isIfToken(parent))
		return parent;
}

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'then')
		return false;
	const ifToken = thenTokenToIf(token);
	if (ifToken === undefined)
		return false;
	const instructionListToken = getNextArgToken(token);
	if (instructionListToken === null)
		return false;
	if (instructionListToken.type === ParseTreeTokenType.LIST)
		return true;
	return true;
}

function convertToList(token, cachedParseTree) {
	let lastDescendent = getSortedLastDescendentTokenOf(token);
	
	const newList = new ParseTreeToken(null, null, token.lineIndex, token.colIndex,
		ParseTreeTokenType.LIST);
	const leftSquareBracket = new ParseTreeToken('[', null, token.lineIndex, token.colIndex - 1,
		ParseTreeTokenType.LEAF);
	const rightSquareBracket = new ParseTreeToken(']', null, lastDescendent.lineIndex, lastDescendent.colIndex + 1,
		ParseTreeTokenType.LEAF);
	const parent = token.parentNode;
	parent.replaceChild(token, newList);
	token.remove();
	newList.appendChild(leftSquareBracket);
	newList.appendChild(token);
	newList.appendChild(rightSquareBracket);
	cachedParseTree.tokensAdded([leftSquareBracket, newList, rightSquareBracket]);
}

export function thenFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	if (tokens.length === 0)
		return;
	tokens.forEach(function(thenToken) {
		const instructionList = getNextArgToken(thenToken);
		instructionList.remove();
		thenToken.parentNode.replaceChild(thenToken, instructionList);
		thenToken.remove();
		if (instructionList.type !== ParseTreeTokenType.LIST) {
			convertToList(instructionList, cachedParseTree);
		}
	});
	cachedParseTree.tokensRemoved(tokens);
	fixLogger.log(`Removed ${tokens.length} then word${tokens.length !== 1 ? 's' : ''} because they are meaningless on their own in WebLogo.`, tokens[0]);
};