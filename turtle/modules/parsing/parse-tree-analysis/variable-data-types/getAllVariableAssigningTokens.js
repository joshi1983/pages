import { Command } from '../../Command.js';
import { ForLoops } from '../ForLoops.js';
import { getParseTokensSorted } from '../../getParseTokensSorted.js';

export function getAllVariableAssigningTokens(cachedParseTree) {
	const result = cachedParseTree.getCommandCallsByNames(['make', 'localmake', 'for']).
	filter(function(token) {
		if (token.children.length < 2)
			return false;
		const info = Command.getCommandInfo(token.val);
		if (info.primaryName === 'for') {
			return ForLoops.getVariableName(token) !== undefined;
		}
		else if (!token.children[0].isStringLiteral())
			return false;
		return true;
	});
	getParseTokensSorted(result);
	return result;
};