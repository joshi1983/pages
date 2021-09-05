import { genericProcessToken } from
'../../../generic-parsing-utilities/genericProcessToken.js';
import { noop } from
'../../../../noop.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processArgList } from './processArgList.js';
import { processAssignment } from './processAssignment.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processCodeBlock } from './processCodeBlock.js';
import { processDef } from './processDef.js';
import { processDim } from './processDim.js';
import { processDo } from './processDo.js';
import { processDoUntil } from './processDoUntil.js';
import { processExpressionDot } from './processExpressionDot.js';
import { processFor } from './processFor.js';
import { processFunctionCall } from './processFunctionCall.js';
import { processIdentifier } from './processIdentifier.js';
import { processIf } from './processIf.js';
import { processLet } from './processLet.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processSelect } from './processSelect.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processSub } from './processSub.js';
import { processTupleLiteral } from './processTupleLiteral.js';
import { processWhile } from './processWhile.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.ARG_LIST, processArgList],
	[ParseTreeTokenType.ASSIGNMENT, processAssignment],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.CODE_BLOCK, processCodeBlock],
	[ParseTreeTokenType.CONST, processLet],
	[ParseTreeTokenType.DECLARE, noop],
	[ParseTreeTokenType.DEF, processDef],
	[ParseTreeTokenType.DIM, processDim],
	[ParseTreeTokenType.DO, processDo],
	[ParseTreeTokenType.DO_UNTIL, processDoUntil],
	[ParseTreeTokenType.END, noop],
	[ParseTreeTokenType.EXPRESSION_DOT, processExpressionDot],
	[ParseTreeTokenType.FOR, processFor],
	[ParseTreeTokenType.FUNCTION, processDef],
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.LABEL, noop],
	[ParseTreeTokenType.LET, processLet],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.REDIM, noop],
	[ParseTreeTokenType.SELECT, processSelect],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.SUB, processSub],
	[ParseTreeTokenType.TREE_ROOT, processCodeBlock],
	[ParseTreeTokenType.TUPLE_LITERAL, processTupleLiteral],
	[ParseTreeTokenType.TYPE, noop],
	[ParseTreeTokenType.WHILE, processWhile]
]);

const processTokenGeneric = genericProcessToken(typeProcessors);
function processToken(token, result, options) {
	if (typeof options !== 'object')
		throw new Error(`options must be an object but found ${options}`);
	const processTokensMap = options.processTokensMap;
	if (processTokensMap !== undefined && processTokensMap.has(token)) {
		processTokensMap.get(token)(token, result, options);
		return;
	}
	processTokenGeneric(token, result, options);
}

export { processToken };