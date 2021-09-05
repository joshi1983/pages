import { fetchJson } from
'../../../../fetchJson.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { processRemoveInMigration } from
'../../helpers/processRemoveInMigration.js';
import { sanitizeQuotes } from
'../../qbasic/scanning/token-sanitizers/sanitizeQuotes.js';
import { scan as scanQBasic } from
'../../qbasic/scanning/scan.js';

const migrationData = await fetchJson('json/logo-migrations/basic/basic-fusion/Basic_Fusion_to_QBasic.json');

const processors = [
	genericProcessTo(migrationData),
	sanitizeQuotes
];

export function scan(code) {
	const scanTokens = scanQBasic(code);
	for (const processor of processors) {
		processor(scanTokens);
	}
	processRemoveInMigration(scanTokens, migrationData);
	return scanTokens;
};