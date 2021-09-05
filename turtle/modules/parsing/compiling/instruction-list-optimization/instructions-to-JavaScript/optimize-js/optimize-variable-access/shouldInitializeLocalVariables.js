import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { isLocalVariablesDeclared } from './isLocalVariablesDeclared.js';
import { isLocalVariablesToken } from '../token-classifiers/isLocalVariablesToken.js';
import { parse } from '../../../../../js-parsing/parse.js';

export function shouldInitializeLocalVariables(jsCode) {
	const parseResult = parse(jsCode);
	const allTokens = flatten(parseResult.root);
	if (isLocalVariablesDeclared(allTokens))
		return true;
	const numGetProcCalls = allTokens.filter(isLocalVariablesToken).length;
	return numGetProcCalls > 1;
};