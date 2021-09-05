import { Command } from '../../Command.js';
import { getTokensByType } from '../../generic-parsing-utilities/getTokensByType.js';
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
	const procCalls = getTokensByType(cachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP).
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
				let extraInfo = '';
				if (paramToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
					extraInfo = `  ${paramToken.val} never outputs a value.`;
				parseLogger.error('All parameters to a procedure must be given a value.  Procedure "' +
					procToken.val + '" is being called with parameter ' + paramName +
					` as no value.  Note that ${procToken.val} requires ${numTokens} inputs.${extraInfo}`, paramToken);
			}
		});
	});
};