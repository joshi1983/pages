import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { processIdentifier } from
'./processIdentifier.js';

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.children.length !== 0)
		return false;
	return token.type === ParseTreeTokenType.FOR;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processEach(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	if (prev.type !== ParseTreeTokenType.FOR) {
		next.type = ParseTreeTokenType.IDENTIFIER;
		return processIdentifier(prev, next, functionsMap);
	}
	const forEach = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.FOR_EACH);
	const forParent = prev.parentNode;
	forParent.replaceChild(prev, forEach);
	forEach.appendChild(prev);
	forEach.appendChild(next);
	return forEach;
};