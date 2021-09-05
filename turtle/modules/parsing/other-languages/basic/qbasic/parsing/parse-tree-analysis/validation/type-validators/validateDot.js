import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.EXPRESSION_DOT
]);

export function validateDot(token, parseLogger) {
	const parent = token.parentNode;
	if (!goodParentTypes.has(parent.type)) {
		parseLogger.error(`Expected DOT to not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	}
};