import { getTokensByType } from '../../../parse-tree-analysis/cached-parse-tree/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { PythonFunctions } from '../../PythonFunctions.js';
import { SetUtils } from '../../../../SetUtils.js';

/*
names of functions that are affected by line cap or line join.
*/
const yesFunctions = new Set([
	'backward', 'circle', 'forward'
]);

for (let name of yesFunctions) {
	const functionInfo = PythonFunctions.getFunctionInfo(name);
	SetUtils.addAll(yesFunctions, functionInfo.names);
}

export function isDependingOnRoundCorners(cachedParseTree) {
	const callTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.FUNCTION_CALL);
	return callTokens.some(token => yesFunctions.has(token.val));
};