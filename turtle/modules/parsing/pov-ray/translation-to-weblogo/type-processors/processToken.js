import { genericProcessToken } from '../../../generic-parsing-utilities/genericProcessToken.js';
import { noop } from '../../../../noop.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processArray } from './processArray.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processConditionalTernary } from './processConditionalTernary.js';
import { processCurvedBracketExpressionOrArgList } from './processCurvedBracketExpressionOrArgList.js';
import { processDeclareOrLocal } from './processDeclareOrLocal.js';
import { processDictionary } from './processDictionary.js';
import { processExpressionDotProperty } from './processExpressionDotProperty.js';
import { processFunction } from './processFunction.js';
import { processIdentifier } from './processIdentifier.js';
import { processIf } from './processIf.js';
import { processParameterizedGroup } from './processParameterizedGroup.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processVectorExpression } from './processVectorExpression.js';
import { processWhile } from './processWhile.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.ARG_LIST, processCurvedBracketExpressionOrArgList],
	[ParseTreeTokenType.ARRAY, processArray],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.CONDITIONAL_TERNARY, processConditionalTernary],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, processCurvedBracketExpressionOrArgList],
	[ParseTreeTokenType.DECLARE, processDeclareOrLocal],
	[ParseTreeTokenType.DICTIONARY, processDictionary],
	[ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, processExpressionDotProperty],
	[ParseTreeTokenType.FUNCTION, processFunction],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.LOCAL, processDeclareOrLocal],
	[ParseTreeTokenType.PARAMETERIZED_GROUP, processParameterizedGroup],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.VECTOR_EXPRESSION, processVectorExpression],
	[ParseTreeTokenType.WHILE, processWhile],
]);

const processToken = genericProcessToken(typeProcessors);
export { processToken };