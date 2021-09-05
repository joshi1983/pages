import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const typeMessageMap = new Map([
	[ParseTreeTokenType.PROCEDURE_START_KEYWORD, 'Invalid procedure name.  This name indicates the start of a procedure.'],
	[ParseTreeTokenType.BOOLEAN_LITERAL, 'Invalid procedure name.  Boolean values are invalid procedure names.'],
	[ParseTreeTokenType.STRING_LITERAL, 'Invalid procedure name.  Remove the quotation mark(").'],
]);

export function getProcedureNameErrorMessage(token) {
	const result = typeMessageMap.get(token.type);
	if (result !== undefined)
		return result;
	if (token.type !== ParseTreeTokenType.LEAF && token.type !== ParseTreeTokenType.NUMBER_LITERAL)
		return 'Valid procedure name expected.';
};