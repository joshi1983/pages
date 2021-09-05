import { Command } from '../../Command.js';
import { isSupportedByHighOrderInvoke } from '../../isSupportedByHighOrderInvoke.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function validateInvoke(cachedParseTree, parseLogger) {
	const invokeCalls = cachedParseTree.getCommandCallsByName('invoke').
		filter(c => c.children.length >= 1);
	const tokenValues = cachedParseTree.getTokenValues();
	const procedures = cachedParseTree.getProceduresMap();
	invokeCalls.forEach(function(invokeCall) {
		const name = tokenValues.get(invokeCall.children[0]);
		if (name !== undefined) {
			if (typeof name === 'string') {
				const commandInfo = Command.getCommandInfo(name);
				if (commandInfo === undefined) {
					const proc = procedures.get(name.toLowerCase());
					if (proc === undefined)
						parseLogger.error(`No procedure or command matches the invoked name of "${name}"`, invokeCall);
					else if (proc.parameters.length !== invokeCall.children.length - 1)
						parseLogger.error(`Procedure "${name}" has ${proc.parameters.length} parameters but your invoke is passing ${invokeCall.children.length - 1}`, invokeCall);
				}
				else if (!isSupportedByHighOrderInvoke(commandInfo)) {
					parseLogger.error(`Unable to call command "${name}" using invoke`, invokeCall, false);
				}
				else {
					const argCount = Command.getArgCount(commandInfo);
					if (argCount.defaultCount !== invokeCall.children.length - 1) {
						if (!argCount.isFlexible)
							parseLogger.error(`Command ${commandInfo.primaryName} expects ${argCount.defaultCount} arguments but your invoke provides ${invokeCall.children.length - 1}`, invokeCall);
					}
				}
			}
			else {
				parseLogger.error('The command or procedure name must be a string', invokeCall, false);
			}
		}
		if (invokeCall.parentNode !== null) {
			if (invokeCall.parentNode.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
				parseLogger.error('invoke should be within curved brackets to clarify how many arguments are needed since we do not know what command or procedure is called.  It would be very troublesome to determine the number of parameters only when the invoke runs and potentially change the number of arguments as the command or procedure changes.', invokeCall);
			}
			else if (invokeCall.parentNode.children[1] !== invokeCall) {
				parseLogger.error('invoke should be at the start of its curved bracket expression.  It would be very troublesome to determine the number of parameters only when the invoke runs and potentially change the number of arguments as the command or procedure changes.', invokeCall);
			}
		}
	});
};