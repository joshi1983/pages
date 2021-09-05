import { fetchJson } from
'../../../../fetchJson.js';
const data = await fetchJson('json/logo-migrations/pascal/turing.json');

const functionsMap = new Map();
for (const commandInfo of data.commands) {
	functionsMap.set(commandInfo.primaryName.toLowerCase(), commandInfo);
}

export class TuringFunction {
	static getAll() {
		return data.commands;
	}

	static getFunctionInfo(name, className) {
		const info = functionsMap.get(name.toLowerCase());
		if (info === undefined)
			return;

		if ((info.className === undefined) !== (className === undefined))
			return;

		if (className === undefined)
			return info;

		if (className === info.className) {
			if (info.isStaticMethod)
				return info;
			else
				return;
		}
		return info;
	}
};