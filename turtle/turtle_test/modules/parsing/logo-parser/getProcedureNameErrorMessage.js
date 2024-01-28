import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { validateIdentifier } from '../parse-tree-analysis/validateIdentifier.js';

const typeMessageMap = new Map([
	[ParseTreeTokenType.PROCEDURE_START_KEYWORD, 'Invalid procedure name.  This name indicates the start of a procedure.'],
	[ParseTreeTokenType.BOOLEAN_LITERAL, 'Invalid procedure name.  Boolean values are invalid procedure names.'],
	[ParseTreeTokenType.STRING_LITERAL, 'Invalid procedure name.  Remove the quotation mark(").'],
	[ParseTreeTokenType.NUMBER_LITERAL, 'Invalid procedure name.  Procedure names must not be numbers or start with a digit.']
]);

export function getProcedureNameErrorMessage(token) {
	const result = typeMessageMap.get(token.type);
	if (result !== undefined)
		return result;
	if (token.type !== ParseTreeTokenType.LEAF)
		return 'Valid procedure name expected.';
	if (typeof token.val === 'string' && validateIdentifier(token.val) !== undefined)
		return 'Invalid procedure name.  "' + token.val + '" ' + validateIdentifier(token.val);
};