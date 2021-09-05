import { Command } from
'../../../../../../modules/parsing/Command.js';
import { commandsMap, productionOnlySet } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/commands/translateSpecialCommandCall.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

function testCommandsMapConsistency(logger) {
	for (const key of commandsMap.keys()) {
		const info = Command.getCommandInfo(key);
		if (info === undefined)
			logger(`Expected to find a command named ${key} but did not`);
		else if (info.primaryName !== key)
			logger(`Found a command from ${key} but it isn't an exact match to ${info.primaryName}.  Replace with ${info.primaryName}.`);
		else {
			const func = commandsMap.get(key);
			if (typeof func !== 'function')
				logger(`Expected value corresponding with ${key} to be a function but got ${func}`);
			else if (func.name !== key)
				logger(`Expected function name corresponding with key ${key} to match but got a function name of ${func.name}`);
		}
	}
}

function testProductionOnlySet(logger) {
	for (const s of productionOnlySet) {
		if (!commandsMap.has(s))
			logger(`Unable to find command ${s} in commandsMap keys.  Every element in productionOnlySet must be in commandsMap.`);
	}
}

export function testTranslateSpecialCommandCall(logger) {
	wrapAndCall([
		testCommandsMapConsistency,
		testProductionOnlySet
	], logger);
};