import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export function validateMatch(token, parseLogger) {
	const children = token.children;
	if (children.length < 2) {
		parseLogger.error(`MATCH must have at least 1 child`, token);
		return;
	}
	const firstChild = children[0];
	const lastChild = children[children.length - 1];
	if (firstChild.type !== ParseTreeTokenType.COLON ||
	firstChild.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET)
		parseLogger.error(`MATCH's first child must be COLON or CURLY_LEFT_BRACKET but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
	if (firstChild.type === ParseTreeTokenType.CURLY_LEFT_BRACKET &&
	lastChild.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET) {
		parseLogger.error(`MATCH's curly brackets are not balanced. Found last child type of ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
	}
};