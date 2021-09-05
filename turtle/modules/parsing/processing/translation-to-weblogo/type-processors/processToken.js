import { genericProcessToken } from '../../../generic-parsing-utilities/genericProcessToken.js';
import { noop } from '../../../../noop.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processArrayInstanceExpression } from './processArrayInstanceExpression.js';
import { processAssignmentOperator } from './processAssignmentOperator.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processCodeBlock } from './processCodeBlock.js';
import { processConditionalTernary } from './processConditionalTernary.js';
import { processCurlyBracketExpression } from './processCurlyBracketExpression.js';
import { processDeclaration } from './processDeclaration.js';
import { processDot } from './processDot.js';
import { processExpressionDot } from './processExpressionDot.js';
import { processExpressionIndexExpressionReadExpression } from './processExpressionIndexExpressionReadExpression.js';
import { processIdentifier } from './processIdentifier.js';
import { processMethod } from './processMethod.js';
import { processMethodCall } from './processMethodCall.js';
import { processNew } from './processNew.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processReturn } from './processReturn.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processThis } from './processThis.js';
import { processTreeRoot } from './processTreeRoot.js';
import { processTry } from './processTry.js';
import { processUnaryOperator } from './processUnaryOperator.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION, processArrayInstanceExpression],
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.CATCH, noop],
	[ParseTreeTokenType.CODE_BLOCK, processCodeBlock],
	[ParseTreeTokenType.CONDITIONAL_TERNARY, processConditionalTernary],
	[ParseTreeTokenType.CURLY_BRACKET_EXPRESSION, processCurlyBracketExpression],
	[ParseTreeTokenType.DECLARATION, processDeclaration],
	[ParseTreeTokenType.DOT, processDot],
	[ParseTreeTokenType.EXPRESSION_DOT, processExpressionDot],
	[ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION, processExpressionIndexExpressionReadExpression],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IMPORT, noop],
	[ParseTreeTokenType.METHOD, processMethod],
	[ParseTreeTokenType.METHOD_CALL, processMethodCall],
	[ParseTreeTokenType.NEW, processNew],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.RETURN, processReturn],
	[ParseTreeTokenType.SEMICOLON, noop],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.THIS, processThis],
	[ParseTreeTokenType.THROW, noop],
	[ParseTreeTokenType.TREE_ROOT, processTreeRoot],
	[ParseTreeTokenType.TRY, processTry],
	[ParseTreeTokenType.UNARY_OPERATOR, processUnaryOperator]
]);

const processToken = genericProcessToken(typeProcessors);
export { processToken };