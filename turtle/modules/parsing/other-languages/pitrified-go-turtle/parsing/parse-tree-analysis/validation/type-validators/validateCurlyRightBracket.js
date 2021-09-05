import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const validParentTypes = new Set([
	ParseTreeTokenType.ARRAY_VALUES_BLOCK,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.COMPOSITE_LITERAL_VALUE,
	ParseTreeTokenType.INTERFACE,
	ParseTreeTokenType.SELECT_BODY,
	ParseTreeTokenType.STRUCT,
	ParseTreeTokenType.STRUCT_VALUES_EXPRESSION,
	ParseTreeTokenType.SWITCH_BODY
]);

export function validateCurlyRightBracket(token, parseLogger) {
	const parent = token.parentNode;
	if (!validParentTypes.has(parent.type)) {
		parseLogger.error(`Expected parent of CURLY_RIGHT_BRACKET to not be a ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	}
};