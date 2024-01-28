import { isContextGlobalVariablesSetCall } from './isContextGlobalVariablesSetCall.js';
import { isNoContextGlobalVariablesSetCall } from './isNoContextGlobalVariablesSetCall.js';

/*
Checks if token represents the function call in JavaScript code like
globalVariables.set("x", 3)
*/
export function isGlobalVariablesSetCall(token) {
	return isNoContextGlobalVariablesSetCall(token) ||
	isContextGlobalVariablesSetCall(token);
};