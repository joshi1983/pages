import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateBinaryOperator } from './validateBinaryOperator.js';
import { validateCurvedBracketExpression } from './validateCurvedBracketExpression.js';
import { validateFunctionCall } from './validateFunctionCall.js';
import { validateIf } from './validateIf.js';
import { validateParseTreeBasics } from
'../../../../../../generic-parsing-utilities/validateParseTreeBasics.js';

const validators = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, validateBinaryOperator],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, validateCurvedBracketExpression],
	[ParseTreeTokenType.FUNCTION_CALL, validateFunctionCall],
	[ParseTreeTokenType.IF, validateIf],
]);

export function validateToken(token, parseLogger) {
	validateParseTreeBasics(token, parseLogger);
	const validator = validators.get(token.type);
	if (validator !== undefined)
		validator(token, parseLogger);
};