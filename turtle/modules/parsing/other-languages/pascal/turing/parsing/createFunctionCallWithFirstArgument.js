import { createFunctionCall } from './createFunctionCall.js';

export function createFunctionCallWithFirstArgument(prev, next) {
	const [funcCall, argList] = createFunctionCall(prev, next);
	argList.appendChild(next);
};