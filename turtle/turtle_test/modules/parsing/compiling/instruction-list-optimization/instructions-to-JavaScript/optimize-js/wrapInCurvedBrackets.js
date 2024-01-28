import { getAllDescendentsAsArray } from '../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getParseTokensSorted } from '../../../../parse-tree-token/getParseTokensSorted.js';
import { insertColIndexSpanAt } from '../../../../generic-parsing-utilities/insertColIndexSpanAt.js';
import { ParseTreeToken } from '../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';

export function wrapInCurvedBrackets(token) {
	const allTokens = getAllDescendentsAsArray(token);
	allTokens.push(token);
	getParseTokensSorted(allTokens);
	const firstToken = allTokens[0];
	const lastToken = allTokens[allTokens.length - 1];

	// add some extra space for the brackets.
	insertColIndexSpanAt(firstToken, 1);
	firstToken.colIndex++;
	insertColIndexSpanAt(lastToken, 1);

	const leftBracket = new ParseTreeToken('(', firstToken.lineIndex, firstToken.colIndex - 1, ParseTreeTokenType.CURVED_LEFT_BRACKET);
	const rightBracket = new ParseTreeToken(')', lastToken.lineIndex, lastToken.colIndex + 1, ParseTreeTokenType.CURVED_RIGHT_BRACKET);
	const curvedBracketExprToken = new ParseTreeToken(null, leftBracket.lineIndex, leftBracket.colIndex, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
	const tokenParent = token.parentNode;
	curvedBracketExprToken.appendChild(leftBracket);
	tokenParent.replaceChild(token, curvedBracketExprToken);
	curvedBracketExprToken.appendChild(token);
	curvedBracketExprToken.appendChild(rightBracket);
	return curvedBracketExprToken;
};