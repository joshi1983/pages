import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateArgList } from './validateArgList.js';
import { validateBinaryOperator } from './validateBinaryOperator.js';
import { validateCase } from './validateCase.js';
import { validateCodeBlock } from './validateCodeBlock.js';
import { validateCurlyRightBracket } from './validateCurlyRightBracket.js';
import { validateCurvedBracketExpression } from './validateCurvedBracketExpression.js';
import { validateDef } from './validateDef.js';
import { validateExpressionDotProperty } from './validateExpressionDotProperty.js';
import { validateFor } from './validateFor.js';
import { validateIdentifier } from './validateIdentifier.js';
import { validateIf } from './validateIf.js';
import { validateLazy } from './validateLazy.js';
import { validateMatch } from './validateMatch.js';
import { validateParseTreeBasics } from '../../../../../generic-parsing-utilities/validateParseTreeBasics.js';
import { validateUnrecognized } from './validateUnrecognized.js';
import { validateWith } from './validateWith.js';

const validators = new Map([
	[ParseTreeTokenType.ARG_LIST, validateArgList],
	[ParseTreeTokenType.BINARY_OPERATOR, validateBinaryOperator],
	[ParseTreeTokenType.CASE, validateCase],
	[ParseTreeTokenType.CODE_BLOCK, validateCodeBlock],
	[ParseTreeTokenType.CURLY_RIGHT_BRACKET, validateCurlyRightBracket],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, validateCurvedBracketExpression],
	[ParseTreeTokenType.DEF, validateDef],
	[ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, validateExpressionDotProperty],
	[ParseTreeTokenType.FOR, validateFor],
	[ParseTreeTokenType.IDENTIFIER, validateIdentifier],
	[ParseTreeTokenType.IF, validateIf],
	[ParseTreeTokenType.LAZY, validateLazy],
	[ParseTreeTokenType.MATCH, validateMatch],
	[ParseTreeTokenType.UNRECOGNIZED, validateUnrecognized],
	[ParseTreeTokenType.WITH, validateWith]
]);

export function validateToken(token, parseLogger) {
	validateParseTreeBasics(token, parseLogger);
	const validator = validators.get(token.type);
	if (validator !== undefined)
		validator(token, parseLogger);
};