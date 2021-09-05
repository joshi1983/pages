import { isContextGlobalVariablesGetCall } from './isContextGlobalVariablesGetCall.js';
import { isContextLocalVariablesGet } from './isContextLocalVariablesGet.js';
import { isContextReadVariableCall } from './isContextReadVariableCall.js';
import { isGlobalVariablesGetCall } from './isGlobalVariablesGetCall.js';
import { isLocalVariablesGetCall } from './isLocalVariablesGetCall.js';

export function isVariableAssignmentRightSideToken(token) {
	return isContextReadVariableCall(token) ||
		isContextGlobalVariablesGetCall(token) ||
		isGlobalVariablesGetCall(token) ||
		isLocalVariablesGetCall(token) ||
		isContextLocalVariablesGet(token);
};