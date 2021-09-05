import { fetchJson } from
'../../../fetchJson.js';
import { sanitizeMigrationInfo } from
'../../../components/code-editor/code-fixer/fixers/helpers/sanitizeMigrationInfo.js';

const migration = await fetchJson('json/logo-migrations/basic/bbc-basic/BBC_Basic.json');
sanitizeMigrationInfo(migration);
const internalFunctionsMap = new Map();
migration.commands.forEach(function(info) {
	internalFunctionsMap.set(info.primaryName.toLowerCase(), info);
});

export const toProcPath = migration.toProcPath;

export class BBCBasicInternalFunctions {
	static getAllFunctionsInfo() {
		return migration.commands;
	}

	static getFullMigrationData() {
		return migration;
	}

	static getFunctionInfo(name, functionsMap) {
		name = name.toLowerCase();
		let result = internalFunctionsMap.get(name);
		if (result !== undefined || functionsMap === undefined)
			return result;
		return functionsMap.get(name);
	}
};