import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateBinaryOperator } from './validateBinaryOperator.js';
import { validateCodeBlock } from './validateCodeBlock.js';
import { validateCurlyRightBracket } from './validateCurlyRightBracket.js';
import { validateCurvedBracketExpression } from './validateCurvedBracketExpression.js';
import { validateFor } from './validateFor.js';
import { validateIf } from './validateIf.js';
import { validateLearn } from './validateLearn.js';
import { validateParametersParent } from './validateParametersParent.js';
import { validateTo } from './validateTo.js';
import { validateVariableReference } from './validateVariableReference.js';

const validators = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, validateBinaryOperator],
	[ParseTreeTokenType.CODE_BLOCK, validateCodeBlock],
	[ParseTreeTokenType.CURLY_RIGHT_BRACKET, validateCurlyRightBracket],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, validateCurvedBracketExpression],
	[ParseTreeTokenType.FOR, validateFor],
	[ParseTreeTokenType.IF, validateIf],
	[ParseTreeTokenType.LEARN, validateLearn],
	[ParseTreeTokenType.PARAMETERS_PARENT, validateParametersParent],
	[ParseTreeTokenType.TO, validateTo],
	[ParseTreeTokenType.VARIABLE_REFERENCE, validateVariableReference],
]);

export function validateToken(token, parseLogger) {
	const validator = validators.get(token.type);
	if (validator !== undefined)
		validator(token, parseLogger);
};