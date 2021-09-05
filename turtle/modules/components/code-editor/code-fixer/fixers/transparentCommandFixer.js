/*
Fixes cases where the code quotes "transparent when it should be calling the transparent command
*/
import { ArrayUtils } from '../../../../ArrayUtils.js';
import { Command } from '../../../../parsing/Command.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();
await ParseTreeToken.asyncInit();
const allCommandsInfoOfInterest = Command.getAllCommandsInfo().
	filter(info => info.args !== undefined && info.args.some(argInfo =>
		argInfo.types.indexOf('transparent') !== -1 &&
		argInfo.types.indexOf('string') === -1));
const namesOfInterest = [];
allCommandsInfoOfInterest.forEach(function(commandInfo) {
	ArrayUtils.pushAll(namesOfInterest, Array.from(Command.getLowerCaseCommandNameSet(commandInfo)));
});
const commandsAcceptingTransparentInputs = new Set(namesOfInterest);

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'transparent' ||
	token.parentNode.type !== ParseTreeTokenType.PARAMETERIZED_GROUP ||
	!commandsAcceptingTransparentInputs.has(token.parentNode.val.toLowerCase()))
		return false;
	const childIndex = token.parentNode.children.indexOf(token);
	const commandInfo = Command.getCommandInfo(token.parentNode.val);
	if (commandInfo.args.length <= childIndex)
		return false;
	const argInfo = commandInfo.args[childIndex];
	return (argInfo.types.indexOf('string') === -1) &&
		(argInfo.types.indexOf('transparent') !== -1);
}

export function transparentCommandFixer(cachedParseTree, fixLogger) {
	const transparentStrings = cachedParseTree.getTokensByType(ParseTreeTokenType.STRING_LITERAL).
		filter(isOfInterest);
	transparentStrings.forEach(function(token) {
		token.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		token.originalString = undefined;
		cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.STRING_LITERAL);
		fixLogger.log('Removed quote on transparent because you should be calling the command instead of using a string literal', token);
	});
};