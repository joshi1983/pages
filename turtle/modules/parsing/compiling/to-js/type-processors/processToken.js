import { noop } from
'../../../../noop.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processBooleanLiteral } from './processBooleanLiteral.js';
import { processLeaf } from './processLeaf.js';
import { processList } from './processList.js';
import { processLongStringLiteral } from './processLongStringLiteral.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processParameterizedGroup } from './processParameterizedGroup.js';
import { processProcedureStartKeyword } from './processProcedureStartKeyword.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processTokens } from './helpers/processTokens.js';
import { processUnaryOperator } from './processUnaryOperator.js';
import { processVariableRead } from './processVariableRead.js';

const processors = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.BOOLEAN_LITERAL, processBooleanLiteral],
	[ParseTreeTokenType.PROCEDURE_END_KEYWORD, noop],
	[ParseTreeTokenType.LEAF, processLeaf],
	[ParseTreeTokenType.LIST, processList],
	[ParseTreeTokenType.LONG_STRING_LITERAL, processLongStringLiteral],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.PARAMETERIZED_GROUP, processParameterizedGroup],
	[ParseTreeTokenType.PROCEDURE_START_KEYWORD, processProcedureStartKeyword],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.UNARY_OPERATOR, processUnaryOperator],
	[ParseTreeTokenType.VARIABLE_READ, processVariableRead]
]);

export function processToken(token, result) {
	const processor = processors.get(token.type);
	if (processor !== undefined)
		processor(token, result);
	else
		processTokens(token.children, result);
};