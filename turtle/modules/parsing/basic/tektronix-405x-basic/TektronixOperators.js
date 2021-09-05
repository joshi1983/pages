import { fetchJson } from '../../../fetchJson.js';
const migrationData = await fetchJson('json/logo-migrations/basic/tektronix-basic/migrationToQBASIC.json');

export class TektronixOperators {
	static getAllData() {
		return migrationData;
	}
};