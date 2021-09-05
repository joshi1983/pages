import { genericProcessToken } from '../../../generic-parsing-utilities/genericProcessToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processFunctionCall } from './processFunctionCall.js';
import { processStringLiteral } from './processStringLiteral.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral]
]);

const processToken = genericProcessToken(typeProcessors);
export { processToken };