import { fetchJson } from
'../../../fetchJson.js';

const data = await fetchJson('json/logo-migrations/l-systems/0L/command-symbols.json');

export class CommandSymbols {
	static getCommandInfo(name) {
		return data[name];
	}
};