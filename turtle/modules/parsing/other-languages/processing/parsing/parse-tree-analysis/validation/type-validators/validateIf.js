import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateIf(token, parseLogger) {
	const children = token.children;
	if (token.val !== 'if')
		parseLogger.error(`Expected val to be if but found ${token.val}`, token);
	if (children.length === 1) {
		const condition = children[0];
		if (condition.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
			parseLogger.error(`If statements should always have a CURVED_BRACKET_EXPRESSION for a condition but found ${ParseTreeTokenType.getNameFor(condition.type)}`, token);
	}
	else if (children.length < 2)
		parseLogger.error(`Expected at least 2 children but found ${children.length}`, token);
	else {
		const firstChild = children[0];
		if (firstChild.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
			parseLogger.error(`Expected first child to be a CURVED_BRACKET_EXPRESSION but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
	}
};