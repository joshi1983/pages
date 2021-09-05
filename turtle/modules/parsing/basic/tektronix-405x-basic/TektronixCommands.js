import { fetchJson } from '../../../fetchJson.js';

const tektronixQBasicMigrationData = await
fetchJson('json/logo-migrations/basic/tektronix-basic/migrationToQBasic.json');


const functionsMap = new Map();
for (const f of tektronixQBasicMigrationData.functions) {
	functionsMap.set(f.name.toLowerCase(), f);
}

export class TektronixCommands {
	static getFunctionInfo(name) {
		return functionsMap.get(name.toLowerCase());
	}
};