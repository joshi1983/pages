import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function validateSwapCalls(cachedParseTree, parseLogger) {
	const swapCalls = cachedParseTree.getCommandCallsByName('swap');
	const variables = cachedParseTree.getVariables();
	swapCalls.forEach(function(swapCall) {
		const children = swapCall.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (!child.isStringLiteral()) {
				parseLogger.error(`Every parameter to the <span class="command">swap command</span> must be a string literal.  Add a " or ' before your value.`, child, true);
				break;
			}
			else {
				const variable = variables.getVariableByName(child.val);
				if (variable === undefined) {
					parseLogger.error(`Unable to find a variable named ${child.val}.  The variable must exist for the <span class="command">swap command</span> to work.`, swapCall, true);
					break;
				}
				const proc = cachedParseTree.getProcedureAtToken(swapCall);
				const scopes = variable.getScopesAt(swapCall, proc);
				if (scopes.length === 0) {
					parseLogger.error(`A variable named ${child.val} is not assigned a value before calling <span class="command">swap</span>.`, swapCall, true);
				}
			}
		}
		const stringVals = children.filter(c => c.isStringLiteral()).map(c => c.val.toLowerCase());
		if (stringVals.length === 2 && stringVals[0] === stringVals[1])
			parseLogger.error(`You are trying to swap a variable with itself which can't do anything.  Click <span class="command">swap</span> to learn more about the command.`, swapCall, true);
	});
};