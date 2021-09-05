import { fetchJson } from
'../../../modules/fetchJson.js';

const data = await fetchJson('json/logo-migrations/turtle-graphics-fun/migration.json');
const index = await fetchJson('logo-scripts/turtle-graphics-fun/index.json');

export function testMigrationToProc(logger) {
	const indexedProcNames = new Set();
	for (const filename of index) {
		const dotIndex = filename.lastIndexOf('.');
		const name = filename.substring(0, dotIndex);
		indexedProcNames.add(name);
	}
	for (const commandInfo of data.commands) {
		const toProc = commandInfo.toProc;
		if (toProc !== undefined && !indexedProcNames.has(toProc)) {
			logger(`Unable to find procedure named ${toProc} in the indexed procedures(Array.from(indexedProcNames).join(',')).`);
		}
	}
};
