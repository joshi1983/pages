import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateArgList } from './validateArgList.js';
import { validateArrayDimensionIndicator } from './validateArrayDimensionIndicator.js';
import { validateArrayInstanceExpression } from './validateArrayInstanceExpression.js';
import { validateClass } from './validateClass.js';
import { validateClassBody } from './validateClassBody.js';
import { validateCodeBlock } from './validateCodeBlock.js';
import { validateConstructor } from './validateConstructor.js';
import { validateDataType } from './validateDataType.js';
import { validateDeclaration } from './validateDeclaration.js';
import { validateDot } from './validateDot.js';
import { validateElse } from './validateElse.js';
import { validateExpressionDot } from './validateExpressionDot.js';
import { validateExtends } from './validateExtends.js';
import { validateFor } from './validateFor.js';
import { validateForLoopSettings } from './validateForLoopSettings.js';
import { validateGenericTypeExpression } from './validateGenericTypeExpression.js';
import { validateIdentifier } from './validateIdentifier.js';
import { validateIf } from './validateIf.js';
import { validateImplements } from './validateImplements.js';
import { validateIndexExpression } from './validateIndexExpression.js';
import { validateMethodCall } from './validateMethodCall.js';
import { validateNew } from './validateNew.js';
import { validateSquareBracket } from './validateSquareBracket.js';
import { validateTry } from './validateTry.js';
import { validateTypeCasting } from './validateTypeCasting.js';
import { validateUnrecognized } from './validateUnrecognized.js';
import { validateWhile } from './validateWhile.js';

const validators = new Map([
	[ParseTreeTokenType.ARG_LIST, validateArgList],
	[ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR, validateArrayDimensionIndicator],
	[ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION, validateArrayInstanceExpression],
	[ParseTreeTokenType.CLASS, validateClass],
	[ParseTreeTokenType.CLASS_BODY, validateClassBody],
	[ParseTreeTokenType.CODE_BLOCK, validateCodeBlock],
	[ParseTreeTokenType.CONSTRUCTOR, validateConstructor],
	[ParseTreeTokenType.DATA_TYPE, validateDataType],
	[ParseTreeTokenType.DECLARATION, validateDeclaration],
	[ParseTreeTokenType.DOT, validateDot],
	[ParseTreeTokenType.ELSE, validateElse],
	[ParseTreeTokenType.EXPRESSION_DOT, validateExpressionDot],
	[ParseTreeTokenType.EXTENDS, validateExtends],
	[ParseTreeTokenType.FOR, validateFor],
	[ParseTreeTokenType.FOR_LOOP_SETTINGS, validateForLoopSettings],
	[ParseTreeTokenType.GENERIC_TYPE_EXPRESSION, validateGenericTypeExpression],
	[ParseTreeTokenType.IDENTIFIER, validateIdentifier],
	[ParseTreeTokenType.IF, validateIf],
	[ParseTreeTokenType.IMPLEMENTS, validateImplements],
	[ParseTreeTokenType.INDEX_EXPRESSION, validateIndexExpression],
	[ParseTreeTokenType.METHOD_CALL, validateMethodCall],
	[ParseTreeTokenType.NEW, validateNew],
	[ParseTreeTokenType.SQUARE_LEFT_BRACKET, validateSquareBracket],
	[ParseTreeTokenType.SQUARE_RIGHT_BRACKET, validateSquareBracket],
	[ParseTreeTokenType.TRY, validateTry],
	[ParseTreeTokenType.TYPE_CASTING, validateTypeCasting],
	[ParseTreeTokenType.UNRECOGNIZED, validateUnrecognized],
	[ParseTreeTokenType.WHILE, validateWhile],
]);

export function validateToken(token, parseLogger) {
	const validator = validators.get(token.type);
	if (validator !== undefined)
		validator(token, parseLogger);
};