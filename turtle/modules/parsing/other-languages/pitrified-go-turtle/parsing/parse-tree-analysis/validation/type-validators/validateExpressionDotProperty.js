import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateExpressionDotProperty(token, parseLogger) {
	const children = token.children;
	if (children.length !== 3) {
		parseLogger.error(`Expected a EXPRESSION_DOT_PROPERTY to have 3 children but found ${children.length}`, token);
	}
	else {
		const last = children[children.length - 1];
		if (last.type !== ParseTreeTokenType.IDENTIFIER &&
		last.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
			parseLogger.error(`Expected last child of EXPRESSION_DOT_PROPERTY to be an identifier or CURVED_BRACKET_EXPRESSION but found ${ParseTreeTokenType.getNameFor(last.type)}`, token);
	}
};