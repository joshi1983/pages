import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const firstChildTypes = new Set([
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER,
]);
const secondChildTypes = new Set([
	ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION
]);

export function validateExpressionIndexExpression(token, parseLogger) {
	const children = token.children;
	if (children.length !== 2)
		parseLogger.error(`Expected 2 children of an EXPRESSION_INDEX_EXPRESSION but found ${children.length}`, token);
	else {
		const first = children[0];
		const second = children[1];
		if (!firstChildTypes.has(first.type))
			parseLogger.error(`Expected first child of EXPRESSION_INDEX_EXPRESSION to be ${Array.from(firstChildTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but found ${ParseTreeTokenType.getNameFor(first.type)}`, token);
		if (!secondChildTypes.has(second.type))
			parseLogger.error(`Expected second child of EXPRESSION_INDEX_EXPRESSION to be ${Array.from(secondChildTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but found ${ParseTreeTokenType.getNameFor(second.type)}`, token);
	}
};