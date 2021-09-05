import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateBinaryOperator } from './validateBinaryOperator.js';
import { validateCase } from './validateCase.js';
import { validateCodeBlock } from './validateCodeBlock.js';
import { validateCurlyRightBracket } from './validateCurlyRightBracket.js';
import { validateCurvedBracketExpression } from './validateCurvedBracketExpression.js';
import { validateDefer } from './validateDefer.js';
import { validateExpressionDotProperty } from './validateExpressionDotProperty.js';
import { validateFor } from './validateFor.js';
import { validateFunc } from './validateFunc.js';
import { validateIdentifier } from './validateIdentifier.js';
import { validateIf } from './validateIf.js';
import { validateImportPackageList } from './validateImportPackageList.js';
import { validateParseTreeBasics } from '../../../../../generic-parsing-utilities/validateParseTreeBasics.js';
import { validateStructValuesExpression } from './validateStructValuesExpression.js';
import { validateUnrecognized } from './validateUnrecognized.js';

const validators = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, validateBinaryOperator],
	[ParseTreeTokenType.CASE, validateCase],
	[ParseTreeTokenType.CODE_BLOCK, validateCodeBlock],
	[ParseTreeTokenType.CURLY_RIGHT_BRACKET, validateCurlyRightBracket],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, validateCurvedBracketExpression],
	[ParseTreeTokenType.DEFER, validateDefer],
	[ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, validateExpressionDotProperty],
	[ParseTreeTokenType.FOR, validateFor],
	[ParseTreeTokenType.FUNC, validateFunc],
	[ParseTreeTokenType.IDENTIFIER, validateIdentifier],
	[ParseTreeTokenType.IF, validateIf],
	[ParseTreeTokenType.IMPORT_PACKAGE_LIST, validateImportPackageList],
	[ParseTreeTokenType.STRUCT_VALUES_EXPRESSION, validateStructValuesExpression],
	[ParseTreeTokenType.UNRECOGNIZED, validateUnrecognized]
]);

export function validateToken(token, parseLogger) {
	validateParseTreeBasics(token, parseLogger);
	const validator = validators.get(token.type);
	if (validator !== undefined)
		validator(token, parseLogger);
};