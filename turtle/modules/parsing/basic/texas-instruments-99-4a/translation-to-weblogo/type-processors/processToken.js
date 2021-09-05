import { ParseTreeTokenType } from '../../../qbasic/ParseTreeTokenType.js';
import { processFunctionCall } from './processFunctionCall.js';

export const processorsMap = new Map([
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall]
]);

export function processToken(token, result, options) {
	const processor = processorsMap.get(token.type);
	processor(token, result, options);
};