import { argListToParameterValueTokens } from './argListToParameterValueTokens.js';
import { functionCallToCommandNameInfo } from './functionCallToCommandNameInfo.js';
import { getDeepestName, getFullPath, generalJsToCommand } from '../processFunctionCall.js';
import { isBracketsNeededForArguments } from
'../helpers/isBracketsNeededForArguments.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

function functionCallToCommandName(token, info) {
	const deepestName = getDeepestName(token);
	const commandNameInfo = functionCallToCommandNameInfo(deepestName, token, new Map([[deepestName, info]]));
	if (commandNameInfo.identifierToken === undefined)
		return commandNameInfo.result;
	let result = commandNameInfo.result;
	const identifierToken = commandNameInfo.identifierToken;
	if (identifierToken.children.length !== 0 &&
	identifierToken.children[0].type === ParseTreeTokenType.DOT) {
		if (identifierToken !== null) {
			const path = getFullPath(identifierToken);
			const cmd = generalJsToCommand.get(path);
			if (cmd !== undefined)
				result = cmd;
		}
	}
	if (result === undefined && deepestName !== undefined)
		return deepestName;
	return result;
}

export function processFunctionCallDefault(token, result, info, processToken) {
	const commandName = functionCallToCommandName(token, info);
	let bracketsNeeded = commandName === undefined ? true : isBracketsNeededForArguments(commandName, token);
	if (bracketsNeeded)
		result.append('(');
	if (typeof commandName === 'string')
		result.append(commandName);
	if (info !== undefined && info.wrapAllParametersWithSquareBrackets)
		result.append(' [ ');
	if (token.children.length > 1) {
		const argsListToken = token.children[1];
		const children = argsListToken.children.slice();
		if (info !== undefined && info.reverseArgs)
			children.reverse();
		for (let child of argListToParameterValueTokens(children)) {
			result.append(' ');
			processToken(child, result);
		}
	}
	if (info !== undefined && info.wrapAllParametersWithSquareBrackets)
		result.append(' ] ');
	if (bracketsNeeded)
		result.append(')');
};