import { Command } from '../../Command.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';
import { validateIdentifier } from '../validateIdentifier.js';
await Command.asyncInit();
const refCommandNames = new Set(Command.getCommandsWithVariableRefTypes().map(i => i.primaryName));
SetUtils.addAll(refCommandNames, ['localmake', 'make']);

export { refCommandNames };

export function mightBeVariableReference(token) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ)
		return true;
	if (validateIdentifier(token.val) !== undefined)
		return false; // string literals with invalid identifiers can't be referencing variables.
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(parent.val);
	if (info === undefined)
		return false;
	if (!refCommandNames.has(info.primaryName))
		return false;
	return true;
};