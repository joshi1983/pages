import { Command } from '../../../../../parsing/Command.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';

export function renameParameterizedGroupToken(cachedParseTree, token, fromName, toName, info, fixLogger, tokensNotToCheck) {
	fixLogger.log(`Renamed "${fromName}" to "${toName}"`, token);
	const oldValue = token.val;
	token.val = toName;
	token.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
	cachedParseTree.tokenValueChanged(token, oldValue);
	cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.LEAF);
	if (info !== undefined) {
		for (let i = 0; i < info.extraTokens.length; i++) {
			const tok = info.extraTokens[i];
			tokensNotToCheck.add(tok);
			tok.remove();
			cachedParseTree.tokenRemoved(tok);
		}
	}
	/*
	Simulate what createParameterizedGroups does by adding enough children to 
	match the required parameters of the command.
	*/
	const commandInfo = Command.getCommandInfo(token.val);
	const argCount = Command.getArgCount(commandInfo);
	if (argCount.isFlexible === false) {
		const remainingLen = token.parentNode.children.length - token.parentNode.children.indexOf(token);
		if (remainingLen > argCount.defaultCount) {
			for (let i = 0; i < argCount.defaultCount && token.nextSibling !== null; i++) {
				const nextSibling = token.nextSibling;
				nextSibling.remove();
				token.appendChild(nextSibling);
			}
		}
		else {
			token.type = ParseTreeTokenType.LEAF;
			cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
		}
	}
};