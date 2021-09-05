import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const badMiddleChildTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.IF
]);

export function validateCurvedBracketExpression(token, parseLogger) {
	const children = token.children;
	if (children.length !== 3) {
		parseLogger.error(`Expected a CURVED_BRACKET_EXPRESSION to have 3 children but found ${children.length}`, token);
	}
	else {
		const left = children[0];
		const middle = children[1];
		const right = children[2];
		if (left.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET)
			parseLogger.error(`Expected first child of a CURVED_BRACKET_EXPRESSION to be a CURVED_LEFT_BRACKET but found ${ParseTreeTokenType.getNameFor(left.type)}`, token);
		if (badMiddleChildTypes.has(middle.type))
			parseLogger.error(`Expected middle child of CURVED_BRACKET_EXPRESSION to not be ${ParseTreeTokenType.getNameFor(middle.type)}`, token);
		if (right.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET)
			parseLogger.error(`Expected last child of a CURVED_BRACKET_EXPRESSION to be a CURVED_RIGHT_BRACKET but found ${ParseTreeTokenType.getNameFor(right.type)}`, token);
	}
};