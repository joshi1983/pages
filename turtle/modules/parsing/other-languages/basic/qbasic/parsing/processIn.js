import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { processIdentifier } from
'./processIdentifier.js';

function getGoodPrevious(token) {
	if (token.type === ParseTreeTokenType.FOR_EACH) {
		const lastChild = token.children[token.children.length - 1];
		if (lastChild.type === ParseTreeTokenType.IDENTIFIER)
			return lastChild;
	}
	return token;
}

export function processIn(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	if (prev.type !== ParseTreeTokenType.IDENTIFIER) {
		next.type = ParseTreeTokenType.IDENTIFIER;
		return processIdentifier(prev, next, functionsMap);
	}
	const prevParent = prev.parentNode;
	prevParent.replaceChild(prev, next);
	prev.remove();
	next.appendChild(prev);
	return next;
};