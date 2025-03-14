import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateArgList } from './validateArgList.js';
import { validateArrayLiteral } from './validateArrayLiteral.js';
import { validateAsync } from './validateAsync.js';
import { validateClass } from './validateClass.js';
import { validateClassBody } from './validateClassBody.js';
import { validateCodeBlock } from './validateCodeBlock.js';
import { validateConditionalTernaryOperator } from './validateConditionalTernaryOperator.js';
import { validateCurlyBracket } from './validateCurlyBracket.js';
import { validateCurlyBracketExpression } from './validateCurlyBracketExpression.js';
import { validateCurvedBracketExpression } from './validateCurvedBracketExpression.js';
import { validateCurvedBracket } from './validateCurvedBracket.js';
import { validateDot } from './validateDot.js';
import { validateElse } from './validateElse.js';
import { validateExport } from './validateExport.js';
import { validateExpressionDot } from './validateExpressionDot.js';
import { validateExpressionIndexExpression } from './validateExpressionIndexExpression.js';
import { validateExtends } from './validateExtends.js';
import { validateFor } from './validateFor.js';
import { validateForLoopSettings } from './validateForLoopSettings.js';
import { validateFunction } from './validateFunction.js';
import { validateFunctionCall } from './validateFunctionCall.js';
import { validateIdentifier } from './validateIdentifier.js';
import { validateIf } from './validateIf.js';
import { validateIndexExpression } from './validateIndexExpression.js';
import { validateRegularExpressionLiteral } from './validateRegularExpressionLiteral.js';
import { validateParseTreeBasics }  from '../../../../../generic-parsing-utilities/validateParseTreeBasics.js';
import { validateSquareBracket } from './validateSquareBracket.js';
import { validateStringLiteral } from './validateStringLiteral.js';
import { validateTry } from './validateTry.js';
import { validateUnrecognized } from './validateUnrecognized.js';
import { validateWhile } from './validateWhile.js';

const validators = new Map([
	[ParseTreeTokenType.ARG_LIST, validateArgList],
	[ParseTreeTokenType.ARRAY_LITERAL, validateArrayLiteral],
	[ParseTreeTokenType.ASYNC, validateAsync],
	[ParseTreeTokenType.CLASS, validateClass],
	[ParseTreeTokenType.CLASS_BODY, validateClassBody],
	[ParseTreeTokenType.CODE_BLOCK, validateCodeBlock],
	[ParseTreeTokenType.CONDITIONAL_TERNARY, validateConditionalTernaryOperator],
	[ParseTreeTokenType.CURLY_BRACKET_EXPRESSION, validateCurlyBracketExpression],
	[ParseTreeTokenType.CURLY_LEFT_BRACKET, validateCurlyBracket],
	[ParseTreeTokenType.CURLY_RIGHT_BRACKET, validateCurlyBracket],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, validateCurvedBracketExpression],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, validateCurvedBracket],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, validateCurvedBracket],
	[ParseTreeTokenType.DOT, validateDot],
	[ParseTreeTokenType.ELSE, validateElse],
	[ParseTreeTokenType.EXPORT, validateExport],
	[ParseTreeTokenType.EXPRESSION_DOT, validateExpressionDot],
	[ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION, validateExpressionIndexExpression],
	[ParseTreeTokenType.EXTENDS, validateExtends],
	[ParseTreeTokenType.FOR, validateFor],
	[ParseTreeTokenType.FOR_LOOP_SETTINGS, validateForLoopSettings],
	[ParseTreeTokenType.FUNCTION, validateFunction],
	[ParseTreeTokenType.FUNCTION_CALL, validateFunctionCall],
	[ParseTreeTokenType.IDENTIFIER, validateIdentifier],
	[ParseTreeTokenType.IF, validateIf],
	[ParseTreeTokenType.INDEX_EXPRESSION, validateIndexExpression],
	[ParseTreeTokenType.REGULAR_EXPRESSION_LITERAL, validateRegularExpressionLiteral],
	[ParseTreeTokenType.SQUARE_LEFT_BRACKET, validateSquareBracket],
	[ParseTreeTokenType.SQUARE_RIGHT_BRACKET, validateSquareBracket],
	[ParseTreeTokenType.STRING_LITERAL, validateStringLiteral],
	[ParseTreeTokenType.TEMPLATE_LITERAL, validateStringLiteral], // same checks as for a string
	[ParseTreeTokenType.TRY, validateTry],
	[ParseTreeTokenType.UNRECOGNIZED, validateUnrecognized],
	[ParseTreeTokenType.WHILE, validateWhile],
]);

export function validateToken(token, parseLogger) {
	const validator = validators.get(token.type);
	if (validator !== undefined)
		validator(token, parseLogger);
	validateParseTreeBasics(token, parseLogger);
	if (token.type !== ParseTreeTokenType.TREE_ROOT &&
	token.parentNode === null)
		parseLogger.error(`parentNode of a ${ParseTreeTokenType.getNameFor(token.type)} should not be null but it is anyway. val=${token.val}`, token);
};