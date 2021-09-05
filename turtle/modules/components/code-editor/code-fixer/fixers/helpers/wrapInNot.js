import { getSortedFirstDescendentTokenOf } from
'../../../../../parsing/generic-parsing-utilities/getSortedFirstDescendentTokenOf.js';
import { ParseTreeToken } from
'../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

export function wrapInNot(token, cachedParseTree) {
	const firstToken = getSortedFirstDescendentTokenOf(token, true);
	const notToken = new ParseTreeToken('not', null, firstToken.lineIndex, firstToken.colIndex - 1,
		ParseTreeTokenType.PARAMETERIZED_GROUP);
	token.parentNode.replaceChild(token, notToken);
	token.remove();
	notToken.appendChild(token);
	cachedParseTree.tokenAdded(notToken);
	return notToken;
};