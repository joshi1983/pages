import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateBinaryOperator(token, parseLogger) {
	const children = token.children;
	if (children.length !== 2)
		parseLogger.error(`2 children expected for BINARY_OPERATOR but got ${children.length}`, token);
	else {
	}
};