import { createFunctionCall } from './createFunctionCall.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { TuringFunction } from
'../TuringFunction.js';

const previousTypesNotExpectingFunctionCall = new Set([
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_LOOP,
	ParseTreeTokenType.END_RECORD,
	ParseTreeTokenType.END_PROCEDURE
]);

function shouldBecomeFunctionCall(prev, identifierToken) {
	if (previousTypesNotExpectingFunctionCall.has(prev.type))
		return false;
	const info = TuringFunction.getFunctionInfo(identifierToken.val);
	if (info !== undefined) {
		return true;
	}
	return false;
}

export function processIdentifier(prev, next) {
	if (shouldBecomeFunctionCall(prev, next)) {
		const [funcCall, argList] = createFunctionCall(next);
		prev.appendChild(funcCall);
		return argList;
	}
	prev.appendChild(next);
	return next;
};