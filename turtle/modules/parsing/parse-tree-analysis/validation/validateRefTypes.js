import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const refTypeCommandNames = Command.getCommandsWithVariableRefTypes().map(info => info.primaryName);

export function validateRefTypes(cachedParseTree, parseLogger) {
	const commandCalls = cachedParseTree.getCommandCallsByNames(refTypeCommandNames);
	const variables = cachedParseTree.getVariables();
	commandCalls.forEach(function(callToken) {
		const info = Command.getCommandInfo(callToken.val);
		for (let paramIndex = 0; paramIndex < info.args.length; paramIndex++) {
			const actualParamToken = callToken.children[paramIndex];
			if (info.args[paramIndex].refTypes !== undefined &&
			actualParamToken.type === ParseTreeTokenType.STRING_LITERAL) {
				if (!variables.hasVariable(actualParamToken.val.toLowerCase()))
					parseLogger.error(`There is no variable named "${actualParamToken.val.toLowerCase()}" given a value before this reference.`,
						actualParamToken);
			}
		}
	});
}