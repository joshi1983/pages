import { forTokenToCodeBlock } from './forTokenToCodeBlock.js';
import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { tokenContainsVariableAssignments } from './tokenContainsVariableAssignments.js';

export function forTokenCodeBlockContainsAssignmentsToControlVariable(forToken) {
	const codeBlock = forTokenToCodeBlock(forToken);
	if (codeBlock !== null) {
		const variableName = forTokenToInitVariableName(forToken);
		if (tokenContainsVariableAssignments(codeBlock, variableName))
			return true;
	}
	return false;
};