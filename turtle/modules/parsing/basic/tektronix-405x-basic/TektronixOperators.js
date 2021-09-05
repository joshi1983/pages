import { fetchJson } from '../../../fetchJson.js';
const migrationData = await fetchJson('json/logo-migrations/basic/tektronix-basic/migrationToQBasic.json');

export class TektronixOperators {
	static getAllData() {
		return migrationData;
	}
};