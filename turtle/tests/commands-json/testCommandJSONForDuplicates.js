import { fetchJson } from '../../modules/fetchJson.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
const commands = await fetchJson('json/commands.json');

export function testCommandJSONForDuplicates(logger) {
	const nameSet = new Set();
	commands.forEach(function(commandInfo) {
		const plogger = prefixWrapper(`Command with primaryName ${commandInfo.primaryName}`, logger);
		const names = commandInfo.names.map(function(name) {
			return name.toLowerCase();
		}).slice(0);
		names.push(commandInfo.primaryName.toLowerCase());
		if (commandInfo.hintNames instanceof Array) {
			commandInfo.hintNames.forEach(function(name) {
				if (name !== name.toLowerCase())
					plogger(`Every hintName should be in lower case but found ${name} instead of ${name.toLowerCase()}`);
				name = name.toLowerCase();
				if (names.indexOf(name) !== -1)
					plogger('hintName ' + name + ' matched an abbreviation or primaryName.');
				else
					names.push(name);
			});
		}
		for (let key of names) {
			if (nameSet.has(key))
				plogger('More than one command matching primaryName or abbreviated name: ' + key);
			else
				nameSet.add(key);
		}
	});
};