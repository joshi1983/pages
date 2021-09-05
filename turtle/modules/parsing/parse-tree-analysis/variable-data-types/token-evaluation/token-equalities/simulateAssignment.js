import { Command } from
'../../../../Command.js';

export function simulateAssignment(token, result, executionState, isInProcedure) {
	const info = Command.getCommandInfo(token.val);
	if (info !== undefined) {
		if (info.primaryName === 'make' &&
		token.children.length === 2 &&
		typeof token.children[0].val === 'string') {
			const variableName = token.children[0].val.toLowerCase();
			executionState.make(variableName, token.children[1], !isInProcedure ||
			!executionState.localVariableNames.has(variableName));
		}
		else if (info.primaryName === 'localmake' &&
		token.children.length === 2 &&
		typeof token.children[0].val === 'string') {
			const variableName = token.children[0].val.toLowerCase();
			const isGlobal = !isInProcedure; // should always be true but
				// this more elegantly handles bad WebLogo code that uses
				// 'localmake' outside of a procedure.
			executionState.make(variableName, token.children[1], isGlobal);
		}
	}
};