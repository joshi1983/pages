import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const parentTypes = new Set([
ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION,
ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
ParseTreeTokenType.IDENTIFIER,
ParseTreeTokenType.STRING_LITERAL
]);

export function validateIndexExpression(token, parseLogger) {
	const parent = token.parentNode;
	if (!parentTypes.has(parent.type))
		parseLogger.error(`Expected parent of INDEX_EXPRESSION to have a type in ${Array.from(parentTypes).map(type => ParseTreeTokenType.getNameFor(type)).join(',')} but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	if (children.length < 3)
		parseLogger.error(`Expected at least 3 children but found ${children.length}`, token);
	else {
		const firstChild = children[0];
		const lastChild = children[children.length - 1];
		if (firstChild.type !== ParseTreeTokenType.SQUARE_LEFT_BRACKET)
			parseLogger.error(`Expected first child to be of type SQUARE_LEFT_BRACKET but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
		if (lastChild.type !== ParseTreeTokenType.SQUARE_RIGHT_BRACKET)
			parseLogger.error(`Expected last child to be of type SQUARE_RIGHT_BRACKET but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
	}
};