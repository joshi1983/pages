import { isContextGlobalVariablesGetCall } from './isContextGlobalVariablesGetCall.js';
import { isContextReadVariableCall } from './isContextReadVariableCall.js';
import { isGlobalVariablesGetCall } from './isGlobalVariablesGetCall.js';
import { isLocalVariablesGetCall } from './isLocalVariablesGetCall.js';

export function isVariableAssignmentRideSideToken(token) {
	return isContextReadVariableCall(token) ||
		isContextGlobalVariablesGetCall(token) ||
		isGlobalVariablesGetCall(token) ||
		isLocalVariablesGetCall(token);
};