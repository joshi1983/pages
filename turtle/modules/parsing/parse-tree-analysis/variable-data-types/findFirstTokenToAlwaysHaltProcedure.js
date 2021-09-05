import { Command } from '../../Command.js';
import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';
await Command.asyncInit();

const haltingNames = new Set();
const breakNames = new Set();

function addLowerCaseNames(set, commandNames) {
	commandNames.forEach(function(name) {
		if (typeof name !== 'string')
			throw new Error(`name must be a string but found ${name}`);
		SetUtils.addAll(set, Command.getLowerCaseCommandNameSet(name));
	});
}

addLowerCaseNames(haltingNames, ['output', 'stop']);
addLowerCaseNames(breakNames, ['break']);

function isBreakOrContinueFoundIn(token) {
	const tokens = getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
	return tokens.some(tok => breakNames.has(tok.val.toLowerCase()));
}

export function findFirstTokenToAlwaysHaltProcedure(startToken) {
	do {
		if (startToken.type === ParseTreeTokenType.PROCEDURE_END_KEYWORD)
			return startToken;
		if (startToken.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
			return;
		if (startToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
		haltingNames.has(startToken.val.toLowerCase())) {
			return startToken;
		}
		if (isBreakOrContinueFoundIn(startToken))
			return; // a break or continue can skip over upcoming procedure halting commands.
		while (startToken !== null) {
			const next = startToken.nextSibling;
			if (next !== null) {
				startToken = next;
				break;
			}
			else {
				startToken = startToken.parentNode;
			}
		}
	} while (startToken !== null);
};