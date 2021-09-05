import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isRememberStackReference(token) {
	const name = token.val.toLowerCase();
	return name === 'remember' || name === 'goback' || name === 'forget';
}

export function isRememberStackNeeded(root) {
	const commands = getDescendentsOfType(root, ParseTreeTokenType.COMMAND);
	return commands.some(isRememberStackReference);
};