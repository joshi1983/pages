import { Command } from '../Command.js';
import { ParseTreeToken } from '../ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
await Command.asyncInit();

export class CommandCalls {
	static isCommandCall(token) {
		if (token === null)
			return false;
		return CommandCalls.getCommandInfo(token) !== undefined;
	}

	static getCommandInfo(token) {
		if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return undefined;
		return Command.getCommandInfo(token.val);
	}

	static tokenMatchesPrimaryName(token, primaryName) {
		if (typeof primaryName !== 'string')
			throw new Error('primaryName must be a string');
		if (token === null || token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		const commandInfo = CommandCalls.getCommandInfo(token);
		if (commandInfo === undefined)
			return false;
		return commandInfo.primaryName === primaryName;
	}

	static tokenMatchesPrimaryNames(token, primaryNames) {
		if (token === null)
			return false;
		if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		const info = Command.getCommandInfo(token.val);
		if (info === undefined)
			return false;
		return primaryNames.indexOf(info.primaryName) !== -1;
	}

/*
primaryNames are the case-sensitive primaryNames of the commands to look for.
For example, don't pass "setpensize" if you mean "setPenSize".
*/
	static filterCommandCalls(tokens, primaryNames) {
		function alwaysMatches() {
			return true;
		}
		function matchesPrimaryNameString(commandInfo) {
			return commandInfo.primaryName === primaryNames;
		}
		function matchesPrimaryNameSet(commandInfo) {
			return primaryNames.has(commandInfo.primaryName);
		}
		if (primaryNames instanceof Array)
			primaryNames = new Set(primaryNames);
		else if (primaryNames !== undefined && typeof primaryNames !== 'string')
			throw new Error('primaryNames must be a string, Array, or undefined.  Not: ' + primaryNames);
		if (!(tokens instanceof Array))
			throw new Error('tokens must be an Array');

		var matches;
		if (primaryNames === undefined)
			matches = alwaysMatches;
		else if (typeof primaryNames === 'string')
			matches = matchesPrimaryNameString;
		else if (primaryNames instanceof Set)
			matches = matchesPrimaryNameSet;
		else
			throw new Error('primaryNames should be undefined, a string, an Array or a Set');

		return tokens.filter(function(token) {
			if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
				return false;
			const commandInfo = Command.getCommandInfo(token.val);
			if (commandInfo === undefined)
				return false;
			return matches(commandInfo);
		});
	}

	static getCommandCalls(tree, primaryNames) {
		return CommandCalls.filterCommandCalls(ParseTreeToken.flatten(tree), primaryNames);
	}
};