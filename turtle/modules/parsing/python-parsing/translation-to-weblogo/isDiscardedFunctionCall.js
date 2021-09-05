import { findTopFunctionCall } from './findTopFunctionCall.js';
import { getAllFunctionDefinitions } from '../parse-tree-analysis/getAllFunctionDefinitions.js';
import { PythonFunctions } from '../PythonFunctions.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isDiscardedFunctionCall(token, cachedParseTree) {
	token = findTopFunctionCall(token);
	if (token === undefined)
		return;

	const functionName = token.val;
	const info = PythonFunctions.getFunctionInfo(functionName);
	if (info !== undefined && info.translateToCommand === null) {
		const functions = getAllFunctionDefinitions(cachedParseTree);
		return !functions.some(f => f.name === functionName);
	}
	return false;
};