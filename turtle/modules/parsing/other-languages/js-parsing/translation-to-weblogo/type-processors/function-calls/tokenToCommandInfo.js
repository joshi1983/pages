import { argListToParameterValueTokens } from './argListToParameterValueTokens.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

function canBeIndependentFunctionCall(token) {
	// if dot found, return false.
	while ((token.type !== ParseTreeTokenType.DOT &&
	token.type !== ParseTreeTokenType.EXPRESSION_DOT) &&
	token.children.length !== 0)
		token = token.children[0];
	return token.type !== ParseTreeTokenType.DOT &&
	token.type !== ParseTreeTokenType.EXPRESSION_DOT;
}

function identifierMatchFound(name, token) {
	while ((token.type !== ParseTreeTokenType.IDENTIFIER ||
	token.val !== name) &&
	token.children.length !== 0)
		token = token.children[0];
	return token.val === name && token.type === ParseTreeTokenType.IDENTIFIER;
}

function isPotentialMatch(token, commandInfo) {
	if (commandInfo.isIndependentFunction !== undefined) {
		const canBeIndependent = canBeIndependentFunctionCall(token);
		if (commandInfo.isIndependentFunction === true &&
		canBeIndependent === false)
			return false;
		if (commandInfo.isIndependentFunction === false &&
		canBeIndependent === true)
			return false;
	}
	if (commandInfo.staticMethodOfClass !== undefined &&
	!identifierMatchFound(commandInfo.staticMethodOfClass, token))
		return false;
	if (commandInfo.argLengthTos instanceof Array) {
		const tokenNumArgs = argListToParameterValueTokens(token.children[1]).length;
		let numArgsMatched = false;
		for (const [numArgs, name] of commandInfo.argLengthTos) {
			if (numArgs === tokenNumArgs) {
				numArgsMatched = true;
				break;
			}
		}
		if (numArgsMatched === false)
			return false;
	}
	return true;
}

/*
token should be a generic-parsing-utilities/ParseTreeToken.
commands should be an Array of objects that have properties like primaryName.
	It is assumed that the commands are already possible matches to primaryName.
	In other words, info.primaryName === the deepest name from token for all info in commands.
*/
export function tokenToCommandInfo(token, commands) {
	for (const info of commands) {
		if (isPotentialMatch(token, info))
			return info;
	}
};