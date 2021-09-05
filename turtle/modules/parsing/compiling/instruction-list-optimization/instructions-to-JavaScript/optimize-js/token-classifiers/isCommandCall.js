import { Command } from '../../../../../Command.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

const groupNames = new Set();
await Command.asyncInit();
Command.getAllCommandsInfo().forEach(function(commandInfo) {
	if (commandInfo.commandGroup !== 'compiled')
		groupNames.add(commandInfo.commandGroup);
});

export function isCommandCall(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL || token.children.length !== 2)
		return false;
	let tok = token.children[0];
	if (tok.val !== 'context' || tok.type !== ParseTreeTokenType.IDENTIFIER || tok.children.length !== 1)
		return false;
	tok = tok.children[0];
	if (tok.val !== '.' || tok.type !== ParseTreeTokenType.DOT || tok.children.length !== 1)
		return false;
	tok = tok.children[0];
	if (tok.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (groupNames.has(tok.val)) {
		if (tok.children.length !== 1)
			return false;
		tok = tok.children[0];
		if (tok.val !== '.' || tok.type !== ParseTreeTokenType.DOT || tok.children.length !== 1)
			return false;
		tok = tok.children[0];
		if (tok.type !== ParseTreeTokenType.IDENTIFIER || tok.children.length !== 0)
			return false;
		const info = Command.getCommandInfo(tok.val);
		if (info === undefined || info.commandGroup !== tok.parentNode.parentNode.val)
			return false;
	}
	else {
		if (tok.children.length !== 0)
			return false;
		const info = Command.getCommandInfo(tok.val);
		if (info === undefined || info.commandGroup !== 'compiled' || tok.val !== info.primaryName)
			return false;
	}
	return true;
};