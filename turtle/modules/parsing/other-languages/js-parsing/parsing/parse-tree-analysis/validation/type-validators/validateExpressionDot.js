import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const firstChildTypes = new Set([
	ParseTreeTokenType.ARRAY_LITERAL,
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL
]);

export function validateExpressionDot(token, parseLogger) {
	const children = token.children;
	if (children.length !== 2)
		parseLogger.error(`Expected 2 children but got ${children.length}`, token);
	else {
		if (!firstChildTypes.has(children[0].type))
			parseLogger.error(`Expected first child to be ${Array.from(firstChildTypes).map(ParseTreeTokenType.getNameFor).join(',')} but got type ${ParseTreeTokenType.getNameFor(children[0].type)}`, token);
		if (children[1].type !== ParseTreeTokenType.DOT)
			parseLogger.error(`Expected second child to be dot but got type ${ParseTreeTokenType.getNameFor(children[1].type)}`, token);
	}
};