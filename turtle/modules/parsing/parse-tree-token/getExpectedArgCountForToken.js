import { Command } from '../Command.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

/*
Similar to a function by the same name in renameParameterizedGroupToken.js but
with some important differences for this use.  The only difference is when the 
associated command's argument count isFlexible.
*/
export function getExpectedArgCountForToken(token) {
	const commandInfo = Command.getCommandInfo(token.val);
	const argCount = Command.getArgCount(commandInfo);
	if (argCount.isFlexible) {
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
			return parent.children.filter(c => !c.isBracket()).length - 1;
		}
	}
	return argCount.defaultCount;
};