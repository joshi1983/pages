import { ParseTreeToken } from
'../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

export function wrapInNot(token, cachedParseTree) {
	const notToken = new ParseTreeToken('not', null, token.lineIndex, token.colIndex - 1,
		ParseTreeTokenType.PARAMETERIZED_GROUP);
	token.parentNode.replaceChild(token, notToken);
	token.remove();
	notToken.appendChild(token);
	cachedParseTree.tokenAdded(notToken);
};