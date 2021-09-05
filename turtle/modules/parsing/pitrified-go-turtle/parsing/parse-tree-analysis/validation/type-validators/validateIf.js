import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodConditionTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
	ParseTreeTokenType.FUNC_CALL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function validateIf(token, parseLogger) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.ELSE_IF) {
		if (token.children.length !== 0)
			parseLogger.error(`Expected IF to have 0 children when parent is ELSE_IF but found ${token.children.length}`, token);
		return;
	}
	else if (token.children.length < 2)
		parseLogger.error(`Expected at least 2 children for IF in general but found ${token.children.length}`, token);
	else {
		const children = token.children;
		const conditionToken = token.children[0];
		const lastChild = children[children.length - 1];
		if (!goodConditionTypes.has(conditionToken.type))
			parseLogger.error(`Did not expect if condition to have type ${ParseTreeTokenType.getNameFor(conditionToken.type)}`, token);
		if (lastChild.type !== ParseTreeTokenType.CODE_BLOCK && lastChild.type !== ParseTreeTokenType.ELSE_IF && lastChild.type !== ParseTreeTokenType.ELSE)
			parseLogger.error(`Expected last child of IF to be a CODE_BLOCK or ELSE_IF or ELSE but got ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
	}
};