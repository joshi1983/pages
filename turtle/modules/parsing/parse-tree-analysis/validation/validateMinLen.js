import { Command } from '../../Command.js';
await Command.asyncInit();

const commandsOfInterest = Command.getAllCommandsInfo().
	filter(info => info.args.some(argInfo =>
		argInfo.minLen !== undefined));
const primaryNames = commandsOfInterest.map(info => info.primaryName);

export function validateMinLen(cachedParseTree, parseLogger) {
	const commandTokens = cachedParseTree.getCommandCallsByNames(primaryNames).
		filter(function(token) {
		if (token.children.length === 0)
			return false;
		const info = Command.getCommandInfo(token.val);
		for (let i = Math.min(token.children.length, info.args.length) - 1; i >= 0; i--) {
			const arg = info.args[i];
			if (arg.minLen !== undefined)
				return true;
		}
		return false;
	});
	const tokenValues = cachedParseTree.getTokenValues();
	commandTokens.forEach(function(token) {
		const info = Command.getCommandInfo(token.val);
		info.args.forEach(function(arg, index) {
			if (token.children.length > index && arg.minLen !== undefined) {
				const child = token.children[index];
				const len = cachedParseTree.getLengthFromToken(child);
				const v = tokenValues.get(child);
				if (len !== undefined) {
					if (arg.minLen > len) {
						let msg;
						if (v === undefined)
							msg = 'The minimum length is ' + arg.minLen + ' but you are inputting a value with length ' + len;
						else if (typeof v === 'string')
							msg = 'The minimum string length is ' + arg.minLen + ' but you are inputting a string with length ' + len;
						else
							msg = 'The minimum list length is ' + arg.minLen + ' for command ' + info.primaryName + ' but you are inputting a list with length ' + len;
						parseLogger.error(msg, token.children[index]);
					}
				}
			}
		});
	});
};