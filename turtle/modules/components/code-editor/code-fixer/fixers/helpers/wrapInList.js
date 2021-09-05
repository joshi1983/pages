import  { getSortedLastDescendentTokenOf } from
'../../../../../parsing/generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeToken } from
'../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

export function wrapInList(token, cachedParseTree) {
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
};