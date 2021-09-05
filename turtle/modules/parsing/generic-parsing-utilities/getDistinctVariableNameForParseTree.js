import { getDistinctVariableName } from './getDistinctVariableName.js';
import { getUsedVariableNames } from './getUsedVariableNames.js';

export function getDistinctVariableNameForParseTree(prefix, root, variableTokenType) {
	if (typeof root !== 'object')
		throw new Error(`Expected root to be an object but got ${root}`);
	const unsafeNames = getUsedVariableNames(root, variableTokenType);
	return getDistinctVariableName(prefix, unsafeNames);
};