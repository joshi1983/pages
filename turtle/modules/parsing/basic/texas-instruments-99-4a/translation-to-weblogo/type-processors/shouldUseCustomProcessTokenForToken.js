import { isApplicableTo as isApplicableToFunctionCall } from './processFunctionCall.js';
import { ParseTreeTokenType } from '../../../qbasic/ParseTreeTokenType.js';
import { processorsMap } from './processToken.js';

const applicableCheckers = new Map([
	[ParseTreeTokenType.FUNCTION_CALL, isApplicableToFunctionCall]
]);

export function shouldUseCustomProcessTokenForToken(token) {
	if (!processorsMap.has(token.type))
		return false;

	const checker = applicableCheckers.get(token.type);
	if (checker !== undefined)
		return checker(token);

	return true;
};