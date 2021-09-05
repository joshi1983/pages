export function processMultiVariableAssignmentFromSingleVariable(token, result, isLocal, leftChildren) {
	const makeCommand = isLocal ? 'localmake' : 'make';
	const rightVarName = token.children[1].val;
	for (let i = 0; i < leftChildren.length; i++) {
		const varName = leftChildren[i].val;
		result.append(`\n${makeCommand} "${varName} `);
		if (i === 0)
			result.append('first');
		else
			result.append(`item ${i + 1}`);
		result.append(' :' + rightVarName);
	}
	result.append('\n');
	return true;
};