import { Command } from '../Command.js';
import { evaluateToken } from './evaluateToken.js';
import { ForLoops } from './ForLoops.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

// varName is assumed to be in lower case.
export function getAssignedValueInToken(varName, token, proceduresMap) {
	if (!(proceduresMap instanceof Map))
		throw new Error('proceduresMap must be a Map');
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined) {
			if (['localmake', 'make'].indexOf(info.primaryName) !== -1) {
				return evaluateToken(token.children[1], proceduresMap);
			}
			if (info.primaryName === 'for') {
				const varToken = ForLoops.getVariableNameToken(token);
				if (varToken !== undefined && typeof varToken.val === 'string' && varToken.val.toLowerCase() === varName)
					return evaluateToken(varNameToken.nextSibling, proceduresMap);
			}
		}
	}
	for (let i = 0; i < token.children.length; i++) {
		const val = getAssignedValueInToken(varName, token.children[i], proceduresMap);
		if (val !== undefined)
			return val;
	}
};