import { isContextGlobalVariableRead } from './isContextGlobalVariableRead.js';
import { isLocalVariableRead } from './isLocalVariableRead.js';
import { isNoContextGlobalVariableRead } from './isNoContextGlobalVariableRead.js';
import { isScopeAgnosticVariableRead } from './isScopeAgnosticVariableRead.js';

export function isVariableReadToken(token) {
	return isContextGlobalVariableRead(token) ||
		isLocalVariableRead(token) ||
		isNoContextGlobalVariableRead(token) ||
		isScopeAgnosticVariableRead(token);
};