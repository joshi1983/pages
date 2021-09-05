import { assignTokenToValueToken } from './assignTokenToValueToken.js';
import { isInstructionList } from '../../isInstructionList.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

function isSafelyIndependentVariableReference(queue2Call, cachedParseTree, variables) {
	if (queue2Call.children.length !== 2)
		return false;
	const varName = queue2Call.children[0].val;
	if (typeof varName !== 'string')
		return false;
	const variable = variables.getVariableByName(varName.toLowerCase());
	if (variable === undefined)
		return false;
	const procedure = cachedParseTree.getProcedureAtToken(queue2Call);
	const scopes = variable.getScopesAt(queue2Call, procedure);
	if (scopes.length === 1) {
		const assignToken = scopes[0].assignToken;
		let valueToken = assignTokenToValueToken(assignToken);
		if (valueToken !== undefined) {
			while (valueToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION && valueToken.children.length > 1)
				valueToken = valueToken.children[1];
			if (valueToken.type === ParseTreeTokenType.LIST)
				return true;
			if (valueToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP && valueToken.val.toLowerCase() === 'list')
				return true;
		}
	}
	return false;
}

export function mightQueue2MutateManyVariables(cachedParseTree, variables) {
	return cachedParseTree.getCommandCallsByName('queue2').some(token => !isSafelyIndependentVariableReference(token, cachedParseTree, variables));
};