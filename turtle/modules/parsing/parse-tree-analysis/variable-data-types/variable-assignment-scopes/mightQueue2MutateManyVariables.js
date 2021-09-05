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
	const commands = ['queue2', 'dequeue2'];
	for (let i = 0; i < commands.length; i++) {
		const result1 = cachedParseTree.getCommandCallsByName(commands[i]).
		some(token => !isSafelyIndependentVariableReference(token, cachedParseTree, variables));
		if (result1 === true)
			return true;
	}
	return false;
};