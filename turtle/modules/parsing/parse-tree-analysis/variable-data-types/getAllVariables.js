import { Command } from '../../Command.js';
import { ForLoops } from '../ForLoops.js';
import { getAllVariableAssigningTokens } from './getAllVariableAssigningTokens.js';
import { Variable } from './Variable.js';
import { Variables } from './Variables.js';

export function getAllVariables(cachedParseTree) {
	const calls = getAllVariableAssigningTokens(cachedParseTree);
	const result = new Variables();
	calls.forEach(function(callToken) {
		const info = Command.getCommandInfo(callToken.val);
		let varName;
		if (info.primaryName === 'for')
			varName = ForLoops.getVariableName(callToken);
		else
			varName = callToken.children[0].val.toLowerCase();
		if (!result.hasVariable(varName)) {
			result.addVariable(new Variable(varName));
		}
	});
	for (const [procName, proc] of cachedParseTree.getProceduresMap()) {
		proc.parameters.forEach(function(paramName) {
			if (!result.hasVariable(paramName)) {
				result.addVariable(new Variable(paramName));
			}
		});
	}
	return result;
};