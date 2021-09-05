import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const minChildren = 5;
const maxChildren = 10;

export function validateVectorExpression(token, parseLogger) {
	if (token.children.length < minChildren) {
		parseLogger.error(`Expected at least ${minChildren} children of VECTOR_EXPRESSION but got ${token.children.length}`, token);
	}
	else if (token.children.length > maxChildren) {
		parseLogger.error(`Expected at most ${maxChildren} children of VECTOR_EXPRESSION but got ${token.children.length}`, token);
	}
	else {
		const firstChild = token.children[0];
		const lastChild = token.children[token.children.length - 1];
		if (firstChild.type !== ParseTreeTokenType.ANGLE_LEFT_BRACKET)
			parseLogger.error(`Expected first child to have type ANGLE_LEFT_BRACKET but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
		if (lastChild.type !== ParseTreeTokenType.ANGLE_RIGHT_BRACKET)
			parseLogger.error(`Expected last child to have type ANGLE_RIGHT_BRACKET but found ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
	}
};