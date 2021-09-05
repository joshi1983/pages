import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.ARG_LIST
]);

export function validateSemicolon(token, parseLogger) {
	const parent = token.parentNode;
	if (!goodParentTypes.has(parent.type)) {
		parseLogger.error(`Expected SEMICOLON to not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	}
};