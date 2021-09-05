import { Command } from '../../Command.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isAlwaysNull(token) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined && info.returnTypes === null)
			return true;
	}
	return false;
}

export function validateProcedureParametersNotNull(cachedParseTree, parseLogger) {
	const procCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
	filter(function(token) {
		if (token.children.length === 0)
			return false;
		return Command.getCommandInfo(token.val) === undefined;
	});
	procCalls.forEach(function(procToken) {
		const procedure = cachedParseTree.getProceduresMap().get(procToken.val.toLowerCase());
		const numTokens = procedure !== undefined ? procedure.parameters.length : procToken.children.length;
		// loop through parameters.
		procToken.children.forEach(function(paramToken, index) {
			if (isAlwaysNull(paramToken)) {
				let paramName = (procedure !== undefined && index < procedure.parameters.length) ? procedure.parameters[index] : '' + index;
				parseLogger.error('All parameters to a procedure must not be null.  Procedure "' +
					procToken.val + '" is being called with parameter ' + paramName +
					' as null.  Note that ' + procToken.val + ' requires ' + numTokens + ' inputs.', paramToken);
			}
		});
	});
};