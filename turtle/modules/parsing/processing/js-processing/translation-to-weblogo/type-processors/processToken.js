import { genericProcessToken } from '../../../../generic-parsing-utilities/genericProcessToken.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';
import { processFunctionCall } from './processFunctionCall.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall],
]);

const processToken = genericProcessToken(typeProcessors);

export { processToken };