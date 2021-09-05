import { fetchJson } from '../modules/fetchJson.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
const commands = await fetchJson('json/commands.json');

export function testCommandJSONForDuplicates(logger) {
	const nameSet = new Set();
	commands.forEach(function(commandInfo) {
		const names = commandInfo.names.map(function(name) {
			return name.toLowerCase();
		}).slice(0);
		names.push(commandInfo.primaryName.toLowerCase());
		if (commandInfo.hintNames instanceof Array) {
			commandInfo.hintNames.forEach(function(name) {
				name = name.toLowerCase();
				if (names.indexOf(name) !== -1)
					logger('hintName ' + name + ' matched an abbreviation or primaryName.');
				else
					names.push(name);
			});
		}
		for (let key of names) {
			if (nameSet.has(key))
				logger('More than one command matching primaryName or abbreviated name: ' + key);
			else
				nameSet.add(key);
		}
	});
};