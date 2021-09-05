import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodConditionTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
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
		const conditionToken = token.children[0];
		const codeBlock1 = token.children[1];
		if (!goodConditionTypes.has(conditionToken.type))
			parseLogger.error(`Did not expect if condition to have type ${ParseTreeTokenType.getNameFor(conditionToken.type)}`, token);
		if (codeBlock1.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected second child of IF to be a CODE_BLOCK but got ${ParseTreeTokenType.getNameFor(codeBlock1.type)}`, token);
	}
};