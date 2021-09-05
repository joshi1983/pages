import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';

export function validateNumberRanges(cachedParseTree, parseLogger) {
	const commandTokens = cachedParseTree.getCommandCallsArray().filter(function(token) {
		if (token.children.length === 0)
			return false;
		const info = Command.getCommandInfo(token.val);
		for (let i = Math.min(token.children.length, info.args.length) - 1; i >= 0; i--) {
			const arg = info.args[i];
			if (arg.min !== undefined || arg.max !== undefined)
				return true;
		}
		return false;
	});
	const tokenValues = cachedParseTree.getTokenValues();
	commandTokens.forEach(function(token) {
		const info = Command.getCommandInfo(token.val);
		info.args.forEach(function(arg, index) {
			if (token.children.length > index) {
				const v = tokenValues.get(token.children[index]);
				if (typeof v === 'number' && !isNaN(v)) {
					if (arg.min !== undefined && arg.min > v)
						parseLogger.error('The minimum is ' + arg.min + ' but you are inputing ' + v, token.children[index]);
					if (arg.max !== undefined && arg.max < v)
						parseLogger.error('The maximum is ' + arg.max + ' but you are inputing ' + v, token.children[index]);
				}
			}
		});
	});
};