import { Command } from
'../../../../../parsing/Command.js';

function needsParameters(commandInfo) {
	if (commandInfo === undefined)
		return false;
	const argCount = Command.getArgCount(commandInfo);
	if (argCount.min !== undefined && argCount.min > 0)
		return true;
	if (argCount.max !== undefined && argCount.max === 0)
		return false;
	return argCount.defaultCount !== 0;
}

export function processBracketedParameters(scanTokens) {
	for (let i = 1; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s === '(') {
			const prev = scanTokens[i - 1];
			const info = Command.getCommandInfo(prev.s);
			if (needsParameters(info) &&
			info.primaryName !== 'ifelse' &&
			info.returnTypes !== null) {
				// adjust the '(' token's position to before the command call.
				token.lineIndex = prev.lineIndex;
				token.colIndex = prev.colIndex + 1 - prev.s.length;

				// swap the '(' and command call tokens.
				scanTokens[i - 1] = token;
				scanTokens[i] = prev;
			}
		}
	}
};