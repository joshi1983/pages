import { getDistinctVariableNameForParseTree } from
'./getDistinctVariableNameForParseTree.js';

export function processGlobalStack(root, result, settings, isStackNeeded, variableTokenType, prefix) {
	if (prefix === undefined)
		prefix = 'stack';
	if (isStackNeeded) {
		const stackVariableName = getDistinctVariableNameForParseTree(prefix, root, variableTokenType);
		settings[prefix + 'VariableName'] = stackVariableName;
		result.append(`make "${stackVariableName} []\n`);
	}
};