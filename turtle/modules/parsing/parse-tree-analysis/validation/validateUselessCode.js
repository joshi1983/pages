/*
This is similar to validateIndependentlyUseful in that it looks for code that does nothing and should be removed or simplfied.
*/
import { Command } from '../../Command.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function processParameterizedGroup(token, parseLogger, tokenValues) {
	const info = Command.getCommandInfo(token.val);
	if (info !== undefined) {
		token.children.forEach(function(childToken, index) {
			if (index < info.args.length) {
				const arg = info.args[index];
				const val = tokenValues.get(childToken);
				if (arg.uselessCases !== undefined) {
					if (arg.uselessCases.indexOf(val) !== -1)
						parseLogger.warn('A constant value of ' + val + ' for input \'' + arg.name + '\' makes the \'' + info.primaryName + '\' command do nothing.  Consider removing or simplifying the code', childToken);
				}
				if (arg.errorCases !== undefined) {
					if (arg.errorCases.indexOf(val) !== -1)
						parseLogger.error('A constant value of ' + val + ' for input \'' + arg.name + '\' would cause an error with the the \'' + info.primaryName + '\' command.', childToken);
				}
			}
		});
	}
}

export function validateUselessCode(cachedParseTree, parseLogger) {
	const tokenValues = cachedParseTree.getTokenValues();
	cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
	filter(token => token.children.length !== 0).
	forEach(function(token) {
		processParameterizedGroup(token, parseLogger, tokenValues);
	});
};