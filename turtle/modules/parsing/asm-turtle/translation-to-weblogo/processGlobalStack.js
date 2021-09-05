import { getDistinctVariableNameForParseTree } from
'../../generic-parsing-utilities/getDistinctVariableNameForParseTree.js';
import { isStackNeeded } from './isStackNeeded.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processGlobalStack(root, result, settings) {
	if (isStackNeeded(root)) {
		const stackVariableName = getDistinctVariableNameForParseTree('stack', root, ParseTreeTokenType.VARIABLE_REFERENCE);
		settings.stackVariableName = stackVariableName;
		result.append(`make "${stackVariableName} []\n`);
	}
};