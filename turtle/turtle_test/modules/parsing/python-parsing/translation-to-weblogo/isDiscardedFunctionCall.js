import { findTopFunctionCall } from './findTopFunctionCall.js';
import { PythonFunctions } from '../PythonFunctions.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isDiscardedFunctionCall(token) {
	token = findTopFunctionCall(token);
	if (token === undefined)
		return;

	const functionName = token.val;
	const info = PythonFunctions.getFunctionInfo(functionName);
	if (info === undefined)
		return false;
	return (info.translateToCommand === null);
};