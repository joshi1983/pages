import { CommentDumpingStringBuffer } from
'../../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { noop } from
'../../../../noop.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processAssignmentOperator } from './processAssignmentOperator.js';
import { processBinaryOperator} from './processBinaryOperator.js';
import { processBooleanLiteral } from './processBooleanLiteral.js';
import { processBreak } from './processBreak.js';
import { processCharacterLiteral } from './processCharacterLiteral.js';
import { processColon } from './processColon.js';
import { processExpressionDotProperty } from './processExpressionDotProperty.js';
import { processDef } from './processDef.js';
import { processFuncCall } from './processFuncCall.js';
import { processIdentifier } from './processIdentifier.js';
import { processIf } from './processIf.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processTokens } from './helpers/processTokens.js';
import { processUnaryOperator } from './processUnaryOperator.js';
import { processVar } from './processVar.js';
import { processWhile } from './processWhile.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.BOOLEAN_LITERAL, processBooleanLiteral],
	[ParseTreeTokenType.BREAK, processBreak],
	[ParseTreeTokenType.CHARACTER_LITERAL, processCharacterLiteral],
	[ParseTreeTokenType.COLON, processColon],
	[ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, processExpressionDotProperty],
	[ParseTreeTokenType.DEF, processDef],
	[ParseTreeTokenType.FUNC_CALL, processFuncCall],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.IMPORT, noop],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.UNARY_OPERATOR, processUnaryOperator],
	[ParseTreeTokenType.VAL, processVar],
	[ParseTreeTokenType.VAR, processVar],
	[ParseTreeTokenType.WHILE, processWhile]
]);

export function processToken(token, result, settings) {
	if (typeof settings !== 'object')
		throw new Error(`settings must be an object but found ${settings}`);
	if (!(result instanceof CommentDumpingStringBuffer))
		throw new Error(`result must be a CommentDumpingStringBuffer.  Not: ${result}`);
	if (typeof token !== 'object')
		throw new Error(`token must be an object and more specifically a ParseTreeToken.  Not ${token}`);

	const tokenProcessor = settings.tokenProcessors.get(token);
	if (tokenProcessor !== undefined) {
		tokenProcessor(token, result, settings);
		return;
	}
	
	const processor = typeProcessors.get(token.type);
	if (processor !== undefined)
		processor(token, result, settings);
	else
		processTokens(token.children, result, settings);
};