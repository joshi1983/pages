import { Command } from
'../../../../../../modules/parsing/Command.js';
import { commandsMap, productionOnlySet } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/commands/translateSpecialCommandCall.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

// essentially reverses what getMethodNameForCommand does
function keyToPrimaryName(key) {
	if ((!key.toLowerCase().endsWith('p') && key.indexOf('_') === -1) ||
	Command.getCommandInfo(key) !== undefined)
		return key;

	let info;
	if (key.toLowerCase().endsWith('p'))
		key = key.substring(0, key.length - 1) + '?';

	info = Command.getCommandInfo(key);
	if (info !== undefined)
		return info.primaryName;

	key = key.replace(/_/g, '.');
	return key;
}

function testCommandsMapConsistency(logger) {
	for (const key of commandsMap.keys()) {
		const primaryName = keyToPrimaryName(key);
		const info = Command.getCommandInfo(primaryName);
		if (info === undefined)
			logger(`Expected to find a command named ${key} but did not`);
		else if (info.primaryName !== primaryName)
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