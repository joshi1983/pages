import { Command } from '../../Command.js';
await Command.asyncInit();

const commandsOfInterest = Command.getAllCommandsInfo().
	filter(info => info.args.some(argInfo =>
		argInfo.maxLen !== undefined));
const primaryNames = commandsOfInterest.map(info => info.primaryName);

/*
Very similar to validateMinLen.
A lot of code is similar but the amount of code duplication 
still seemed simpler, clearer and more maintainable than making things more generic.
*/
export function validateMaxLen(cachedParseTree, parseLogger) {
	const commandTokens = cachedParseTree.getCommandCallsByNames(primaryNames).
		filter(function(token) {
		if (token.children.length === 0)
			return false;
		const info = Command.getCommandInfo(token.val);
		for (let i = Math.min(token.children.length, info.args.length) - 1; i >= 0; i--) {
			const arg = info.args[i];
			if (arg.maxLen !== undefined)
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
					if (arg.maxLen < len) {
						let msg;
						const forCommandStr = ` for command <span class="command">${info.primaryName}</span>`;
						if (v === undefined)
							msg = `The maximum length is ${arg.maxLen}${forCommandStr} but you are inputting a value with length ${len}`;
						else if (typeof v === 'string')
							msg = `The maximum string length is ${arg.maxLen}${forCommandStr} but you are inputting a string with length ${len}`;
						else
							msg = `The maximum list length is ${arg.maxLen}${forCommandStr} but you are inputting a list with length ${len}`;
						parseLogger.error(msg, token.children[index], true);
					}
				}
			}
		});
	});
};