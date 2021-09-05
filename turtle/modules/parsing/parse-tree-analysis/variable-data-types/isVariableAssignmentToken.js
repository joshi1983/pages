import { Command } from '../../Command.js';
import { ForLoops } from '../ForLoops.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function isVariableAssignmentToken(token) {
	if (token.children.length < 2 || token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	if (info.primaryName === 'for') {
		return ForLoops.getVariableName(token) !== undefined;
	}
	else if (!token.children[0].isStringLiteral())
		return false;
	return info.primaryName === 'make' || info.primaryName === 'localmake';
};