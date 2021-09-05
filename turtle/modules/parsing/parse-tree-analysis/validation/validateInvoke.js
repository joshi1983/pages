import { Command } from '../../Command.js';
import { isSupportedByHighOrderInvoke } from '../../isSupportedByHighOrderInvoke.js';

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
	});
};