import { Command } from '../../../../../../../parsing/Command.js';
import { isOperatorAfterCallToken } from '../function-calls/isOperatorAfterCallToken.js';
import { ParseTreeTokenType } from
'../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
await Command.asyncInit();
const ignoredTypes = new Set([
ParseTreeTokenType.COMMA,
ParseTreeTokenType.CURVED_LEFT_BRACKET,
ParseTreeTokenType.CURVED_RIGHT_BRACKET
]);

function countActualParametersInFunctionCall(funcCallToken) {
	if (funcCallToken.children.length === 2) {
		const argList = funcCallToken.children[1];
		let result = 0;
		for (const child of argList.children) {
			if (!ignoredTypes.has(child.type))
				result++;
		}
		return result;
	}
	return 0;
}

export function isBracketsNeededForArguments(commandName, callToken) {
	const info = Command.getCommandInfo(commandName);
	let argCount;
	const tokenArgCount = countActualParametersInFunctionCall(callToken);
	if (info !== undefined) {
		argCount = Command.getArgCount(info);
		if (argCount.isFlexible !== true) {
			if (tokenArgCount === 0 && argCount.defaultCount === 0) {
				return false;
			}
		}
	}
	if (isOperatorAfterCallToken(callToken))
		return true;
	if (info === undefined)
		return false;
	if (argCount.isFlexible !== true)
		return false;
	if (argCount.defaultCount === tokenArgCount)
		return false;
	return true;
}