import { Command } from '../../../../../parsing/Command.js';
import { getArgCount } from
'../../../../../parsing/generic-parsing-utilities/getArgCount.js';
import { moveArgsForParameterizedGroup } from
'./moveArgsForParameterizedGroup.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function getExpectedArgCountForToken(token, info) {
	const tempInfo = Command.getCommandInfo(token.val);
	if (tempInfo !== undefined)
		info = tempInfo;
	return getArgCount(info, token);
}

export function renameParameterizedGroupToken(cachedParseTree, token, fromName, 
toName, info, fixLogger, tokensNotToCheck) {
	fixLogger.log(`Renamed "${fromName}" to "${toName}"`, token);
	const oldType = token.type;
	const oldValue = token.val;
	token.val = toName;
	if (toName !== oldValue)
		cachedParseTree.tokenValueChanged(token, oldValue);
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
	const expectedArgCount = getExpectedArgCountForToken(token, info);
	const remainingLen = token.parentNode.children.length - token.parentNode.children.indexOf(token);
	if (remainingLen > expectedArgCount) {
		moveArgsForParameterizedGroup(token, expectedArgCount);
	}
	if ((token.children.length !== 0 || expectedArgCount === 0) &&
	token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP) {
		token.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		cachedParseTree.tokenTypeChanged(token, oldType);
	}
};