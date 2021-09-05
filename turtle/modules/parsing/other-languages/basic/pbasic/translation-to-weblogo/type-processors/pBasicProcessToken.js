import { isApplicableTo as fcIsApplicableTo, processFunctionCall } from './processFunctionCall.js';
import { isApplicableTo as idIsApplicableTo, processIdentifier } from './processIdentifier.js';
import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';

const processors = new Map([
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier]
]);
const applicables = [
	fcIsApplicableTo,
	idIsApplicableTo
];

export function isApplicableTo(token) {
	const processor = processors.get(token.type);
	if (processor === undefined)
		return false;
	return applicables.some(isApplicable => isApplicable(token));
};

export function pBasicProcessToken(token, result, options) {
	const processor = processors.get(token.type);
	processor(token, result, options);
};