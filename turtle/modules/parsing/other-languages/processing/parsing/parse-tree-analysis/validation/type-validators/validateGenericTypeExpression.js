import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateGenericTypeExpression(token, parseLogger) {
	const children = token.children;
	if (children.length < 3)
		parseLogger.error(`Expected at least 3 children from GENERIC_TYPE_EXPRESSION but found ${children.length}`, token);
	else {
		const first = children[0];
		const last = children[children.length - 1];
		if (first.val !== '<')
			parseLogger.error(`Expected first child of GENERIC_TYPE_EXPRESSION to have val < but got ${first.val}`, token);
		if (first.type !== ParseTreeTokenType.GENERIC_LEFT_BRACKET)
			parseLogger.error(`Expected first child of GENERIC_TYPE_EXPRESSION to have type GENERIC_LEFT_BRACKET but got ${ParseTreeTokenType.getNameFor(first.type)}`, token);
		if (last.val !== '>')
			parseLogger.error(`Expected last child of GENERIC_TYPE_EXPRESSION to have val > but got ${last.val}`, token);
		if (last.type !== ParseTreeTokenType.GENERIC_RIGHT_BRACKET)
			parseLogger.error(`Expected last child of GENERIC_TYPE_EXPRESSION to have type GENERIC_RIGHT_BRACKET but got ${ParseTreeTokenType.getNameFor(last.type)}`, token);
	}
};