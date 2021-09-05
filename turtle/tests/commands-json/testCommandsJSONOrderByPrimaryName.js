import { fetchJson } from '../../modules/fetchJson.js';
const commands = await fetchJson('json/commands.json');

export function testCommandsJSONOrderByPrimaryName(logger) {
	for (let i = 1; i < commands.length; i++) {
		if (commands[i].primaryName.toLowerCase() <= commands[i - 1].primaryName.toLowerCase()) {
			logger(`primaryNames ${commands[i].primaryName} and ${commands[i - 1].primaryName} are out of order in json/commands.json`);
		}
	}
};