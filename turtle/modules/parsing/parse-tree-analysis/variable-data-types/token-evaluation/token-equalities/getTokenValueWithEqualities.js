import { Command } from
'../../../../Command.js';
import { getCommandGroups } from
'../../../../../command-groups/getCommandGroups.js';
import { getMethodNameForCommand } from
'../../../../getMethodNameForCommand.js';
import { getTokenValueBasic } from
'../../getTokenValueBasic.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { unwrapCurvedBracketExpressions } from
'./unwrapCurvedBracketExpressions.js';
await Command.asyncInit();

const commandGroups = getCommandGroups(undefined);

export function getTokenValueWithEqualities(token, tokenEqualities) {
	token = unwrapCurvedBracketExpressions(token);
	const value = getTokenValueBasic(token);
	if (value !== undefined)
		return value;

	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined && info.isStaticEvaluationSafe) {
			const childValues = [];
			for (const child of token.children) {
				const childVal = getTokenValueWithEqualities(child, tokenEqualities);
				if (childVal === undefined)
					return;
				childValues.push(childVal);
			}
			try {
				const group = commandGroups.get(info.commandGroup);
				const name = getMethodNameForCommand(info.primaryName);
				let f = group[name];
				if (f === undefined)
					f = group.prototype[name];
				const result = f(...childValues);
				if (typeof result === 'number' && isNaN(result))
					return undefined;
				return result;
			}
			catch (e) {
				// If an error is thrown trying to evaluate, just ignore it.
			}
		}
		return;
	}
	for (const [fromToken, toTokens] of tokenEqualities) {
		if (toTokens.has(token))
			return getTokenValueWithEqualities(fromToken, tokenEqualities);
	}
};