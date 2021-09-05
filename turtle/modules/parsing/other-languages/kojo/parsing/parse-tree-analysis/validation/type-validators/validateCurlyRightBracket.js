import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const validParentTypes = new Set([
	ParseTreeTokenType.CLASS_OBJECT_BODY,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.MATCH
]);

export function validateCurlyRightBracket(token, parseLogger) {
	const parent = token.parentNode;
	if (!validParentTypes.has(parent.type)) {
		parseLogger.error(`Expected parent of CURLY_RIGHT_BRACKET to not be a ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	}
};