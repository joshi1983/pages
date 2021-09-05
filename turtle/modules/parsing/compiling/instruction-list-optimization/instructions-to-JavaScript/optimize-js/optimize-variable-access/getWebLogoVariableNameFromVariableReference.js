import { ArrayUtils } from '../../../../../../ArrayUtils.js';
import { Command } from '../../../../../Command.js';
import { evaluateStringLiteral } from '../../../../../js-parsing/evaluateStringLiteral.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';
import { tokenToCommandInfo } from '../token-classifiers/tokenToCommandInfo.js';

const primaryNameToArgIndexMap = new Map();
await Command.asyncInit();
Command.getCommandsWithVariableRefTypes().forEach(function(info) {
	const index = ArrayUtils.indexOfMatch(info.args, argInfo => argInfo.refTypes !== undefined);
	if (index !== -1)
		primaryNameToArgIndexMap.set(info.primaryName, index);
});

export function getWebLogoVariableNameFromVariableReference(token) {
	const argList = token.children[1];
	const commandInfo = tokenToCommandInfo(token);
	const nameIndex = primaryNameToArgIndexMap.get(commandInfo.primaryName);
	const childrenIndex = 1 + nameIndex * 2;
	const nameToken = argList.children[childrenIndex];
	if (nameToken === undefined)
		throw new Error(`Unable to find child at index ${childrenIndex} in argList that has valid indexes 0..${argList.children.length - 1}. nameIndex = ${nameIndex}, primaryName=${commandInfo.primaryName}`);
	if (nameToken.type !== ParseTreeTokenType.STRING_LITERAL)
		return;
	return evaluateStringLiteral(nameToken.val);
};