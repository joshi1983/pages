import { Command } from
'../Command.js';
import { getDescendentsOfType } from
'../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function mightHaveSideEffects(token) {
	const descendents = getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
	for (const pg of descendents) {
		const info = Command.getCommandInfo(pg.val);
		if (info === undefined)
			return true; // procedure calls might have side effects.
			// FIXME: don't return true when the procedures definitely have no side effects.
			//  For example, to doubleVal :x output 2 * :x end

		if (info.isIndependentlyUseful === true)
			return true;
	}
	return false;
};