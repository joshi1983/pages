import { fetchJson } from
'../../../../fetchJson.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { processMigrateToVal } from
'../../helpers/processMigrateToVal.js';
import { processThenGoto } from
'../../helpers/processThenGoto.js';
import { processRemoveInMigration } from '../../helpers/processRemoveInMigration.js';
import { removeRedundantCallTokens } from
'./scantoken-processors/removeRedundantCallTokens.js';
import { scan as qbScan } from
'../../qbasic/scanning/scan.js';
const migrationInfo = await fetchJson('json/logo-migrations/basic/texas-instruments-99-4a/migrationToQBasic.json');

const processors = [
	genericProcessTo(migrationInfo),
	processMigrateToVal(migrationInfo),
	processRemoveInMigration,
	processThenGoto,
	removeRedundantCallTokens
];

export function scan(code) {
	const tokens = qbScan(code);
	for (const processor of processors) {
		processor(tokens, migrationInfo);
	}

	return tokens;
};