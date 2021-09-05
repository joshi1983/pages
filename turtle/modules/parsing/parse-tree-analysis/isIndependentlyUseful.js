import { Command } from '../Command.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isProcedureIndependentlyUseful(procName, proceduresMap) {
	// FIXME: check if calling the specified procedure would be independently useful.
	return true; 
}

export function areChildrenIndependentlyUseful(token, proceduresMap) {
	for (let i = 0; i < token.children.length; i++) {
		const ctoken = token.children[i];
		if (isIndependentlyUseful(ctoken, proceduresMap))
			return true;
	}
	return false;
};

export function isIndependentlyUseful(token, proceduresMap) {
	if (!(proceduresMap instanceof Map))
		throw new Error('proceduresMap must be a Map');

	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const commandInfo = Command.getCommandInfo(token.val);
		if (commandInfo !== undefined) {
			if (commandInfo.isIndependentlyUseful)
				return true;
		}
		else if (isProcedureIndependentlyUseful(token.val, proceduresMap))
			return true;
	}
	else if (token.type === ParseTreeTokenType.LEAF)
		return false;

	return areChildrenIndependentlyUseful(token, proceduresMap);
};