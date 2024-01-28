import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const firstChildTypes = new Set([
	ParseTreeTokenType.ARRAY_LITERAL,
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.THIS
]);

export function validateExpressionIndexExpression(token, parseLogger) {
	const children = token.children;
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DOT)
		parseLogger.error(`An EXPRESSION_INDEX_EXPRESSION should not have a DOT type parent but found one.`, token);
	if (children.length !== 2)
		parseLogger.error(`An EXPRESSION_INDEX_EXPRESSION should have 2 children but found ${children.length}`, token);
	else {
		const firstChild = children[0];
		const lastChild = children[1];
		if (!firstChildTypes.has(firstChild.type))
			parseLogger.error(`Expected first child of EXPRESSION_INDEX_EXPRESSION to be one of ${Array.from(firstChildTypes).map(t => ParseTreeTokenType.getNameFor(t))} but got type ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
		if (lastChild.type !== ParseTreeTokenType.INDEX_EXPRESSION)
			parseLogger.error(`Expected second child of EXPRESSION_INDEX_EXPRESSION to be an INDEX_EXPRESSION but got type ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
	}
};