import { Command } from '../Command.js';
import { getDescendentsOfType } from '../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
await Command.asyncInit();

const commandsAffectingPenSize = new Set(['penNormal', 'setPenSize', 'setTurtleState']);
const setPenSizeNames = Command.getLowerCaseCommandNameSet(Command.getCommandInfo('setPenSize'));
const shouldBeIgnoredTypes = new Set([
	ParseTreeTokenType.PROCEDURE_START_KEYWORD,
	ParseTreeTokenType.LIST
]);

function mightTokenAffectPenSize(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return true; // assume any procedure could affect pen size.
	return commandsAffectingPenSize.has(info.primaryName);
}

function mightAffectPenSize(token) {
	if (mightTokenAffectPenSize(token))
		return true;
	const tokens = getDescendentsOfType(token, ParseTreeTokenType.PARAMETRIZED_GROUP);
	return tokens.some(mightTokenAffectPenSize);
}

function shouldBeIgnored(token) {
	return shouldBeIgnoredTypes.has(token.type);
}

/*
Ideally, isPenSizeAlwaysZeroAtToken will decide what the name implies perfectly and always but
we don't always know if penSize will be 0 at token.

In cases where we can't determine for sure if penSize is always 0, we return false.
*/
export function isPenSizeAlwaysZeroAtToken(token, cachedParseTree) {
	while (token !== null && !token.isBracket()) {
		if (!shouldBeIgnored(token)) {
			if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP && setPenSizeNames.has(token.val.toLowerCase())) {
				const tokenValues = cachedParseTree.getTokenValues();
				if (tokenValues.get(token.children[0]) === 0)
					return true;
				return false;
			}
			if (mightAffectPenSize(token))
				return false;
		}
		token = token.previousSibling;
	}
	return false;
};