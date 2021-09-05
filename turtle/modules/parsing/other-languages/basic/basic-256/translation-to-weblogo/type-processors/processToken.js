import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';
import { isApplicableTo as isApplicableToFunctionCall, processFunctionCall } from
'./processFunctionCall.js';
import { isApplicableTo as isApplicableToIdentifier, processIdentifier } from
'./processIdentifier.js';
import { isApplicableTo as isApplicableToStringLiteral, processStringLiteral } from
'./processStringLiteral.js';

const processors = new Map([
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral]
]);
const applicables = [
	isApplicableToFunctionCall,
	isApplicableToIdentifier,
	isApplicableToStringLiteral
];

export function isApplicableTo(token) {
	return applicables.some(a => a(token));
};

export function processToken(token, result, options) {
	const processor = processors.get(token.type);
	processor(token, result, options);
};