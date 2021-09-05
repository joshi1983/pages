import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.CLASS,
	ParseTreeTokenType.DICTIONARY_KEY_VALUE_PAIR,
	ParseTreeTokenType.ELIF,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.FOR_LOOP,
	ParseTreeTokenType.FUNCTION_DEFINITION,
	ParseTreeTokenType.IF_STATEMENT,
	ParseTreeTokenType.SUBSCRIPT,
	ParseTreeTokenType.TRY,
	ParseTreeTokenType.WITH,
	ParseTreeTokenType.WHILE_LOOP
]);

export function validateColon(token, parseLogger) {
	const parent = token.parentNode;
	if (!goodParentTypes.has(parent.type))
		parseLogger.error(`Parent of a COLON should not be ${ParseTreeTokenType.getNameFor(parent.type)}.`, token);
};