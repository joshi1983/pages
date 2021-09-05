import { convertHashSingleLineComments } from
'../../helpers/convertHashSingleLineComments.js';
import { fetchJson } from
'../../../../fetchJson.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { joinKeywords } from
'./joinKeywords.js';
import { processClg } from
'./processClg.js';
import { processKeywords } from
'../../helpers/processKeywords.js';
import { processRemoveInMigration } from
'../../helpers/processRemoveInMigration.js';
import { processToProc } from
'../../helpers/processToProc.js';
import { scan as scanQBasic } from
'../../qbasic/scanning/scan.js';

const migrationData = await fetchJson('json/logo-migrations/basic/basic-256/migrateToQBasic.json');

const processors = [
	convertHashSingleLineComments,
	genericProcessTo(migrationData),
	joinKeywords,
	processClg,
	processToProc(migrationData)
];

export function scan(code) {
	const scanTokens = scanQBasic(code);
	for (const processor of processors) {
		processor(scanTokens);
	}
	processRemoveInMigration(scanTokens, migrationData);
	processKeywords(scanTokens, migrationData);
	return scanTokens;
};