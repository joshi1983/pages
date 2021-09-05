import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';

export function validateMinLen(cachedParseTree, parseLogger) {
	const commandTokens = cachedParseTree.getCommandCallsArray().filter(function(token) {
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
				const v = tokenValues.get(token.children[index]);
				if (v instanceof Array || typeof v === 'string') {
					if (arg.minLen > v.length) {
						let msg;
						if (typeof v === 'string')
							msg = 'The minimum string length is ' + arg.minLen + ' but you are inputting a string with length ' + v.length;
						else
							msg = 'The minimum list length is ' + arg.minLen + ' for command ' + info.primaryName + ' but you are inputting a list with length ' + v.length;
						parseLogger.error(msg, token.children[index]);
					}
				}
			}
		});
	});
};