/*
The process of parsing should catch all problems involving argument count so this is only a backup in case that fails.
*/
import { Command } from '../../Command.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function formatMessage(prefix, required, actual) {
	return `${prefix} requires ${required} but ${actual} inputs found`;
}

export function validateParameterizedGroup(token, proceduresMap) {
	const commandInfo = Command.getCommandInfo(token.val);
	if (commandInfo !== undefined) {
		const argCount = Command.getArgCount(commandInfo);
		if (argCount.defaultCount !== token.children.length) {
			if (argCount.isFlexible) {
				if (argCount.min !== undefined && argCount.min > token.children.length)
					return `Command ${commandInfo.primaryName} requires at least ${argCount.min} inputs but got ${token.children.length}`;
				else if (argCount.max !== undefined && argCount.max < token.children.length)
					return `Command ${commandInfo.primaryName} requires at most ${argCount.max} inputs but got ${token.children.length}`;
			}
			if (!argCount.isFlexible || token.parentNode.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
				return formatMessage('Command ' + commandInfo.primaryName, argCount.defaultCount, token.children.length);
		}
	}
	else {
		const proc = proceduresMap.get(token.val.toLowerCase());
		if (proc !== undefined) {
			if (proc.parameters.length !== token.children.length)
				return formatMessage('Procedure ' + proc.name, proc.parameters.length, token.children.length);
		}
	}
};

export function validateArgumentCounts(cachedParseTree, parseLogger) {
	cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
	forEach(function(token) {
		const msg = validateParameterizedGroup(token, cachedParseTree.getProceduresMap());
		if (msg !== undefined)
			parseLogger.error(msg, token);
	});
};