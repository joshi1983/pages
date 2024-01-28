import { isContextGlobalVariableRead } from './isContextGlobalVariableRead.js';
import { isLocalVariableRead } from './isLocalVariableRead.js';
import { isNoContextGlobalVariableRead } from './isNoContextGlobalVariableRead.js';
import { isScopeAgnosticVariableRead } from './isScopeAgnosticVariableRead.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isVariableReadToken(token) {
	return isContextGlobalVariableRead(token) ||
		isLocalVariableRead(token) ||
		isNoContextGlobalVariableRead(token) ||
		isScopeAgnosticVariableRead(token);
};