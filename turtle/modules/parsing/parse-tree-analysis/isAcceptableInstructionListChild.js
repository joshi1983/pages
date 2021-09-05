import { Command } from '../Command.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
await Command.asyncInit();

export function isAcceptableInstructionListChild(token) {
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION && token.children.length === 3 &&
	token.children[1].type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.children[1].val);
		if (info === undefined)
			return false;
		if (info.primaryName === 'invoke')
			return true;
		const argCount = Command.getArgCount(info);
		if (argCount.isFlexible &&
		argCount.defaultCount !== token.children[1].children.length &&
		info.returnTypes === null)
			return true;
	}
	return false;
};