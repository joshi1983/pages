import { ParseTreeTokenType } from
'../../../js-parsing/ParseTreeTokenType.js';
import { isApplicableTo as isApplicableToFunctionCall, processFunctionCall } from
'./processFunctionCall.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall]
]);

const applicables = [
	isApplicableToFunctionCall
];

export function isApplicableTo(token) {
	return applicables.some(applicable => applicable(token));
};

export function processToken(token, result, options) {
	const process = typeProcessors.get(token.type);
	process(token, result, options);
};