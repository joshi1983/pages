import { fetchJson } from '../../../../fetchJson.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { processRemoveInMigration } from
'../../helpers/processRemoveInMigration.js';
import { scan } from '../../qbasic/scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';
import { translateOperators } from '../../helpers/translateOperators.js';
const migrationData = await fetchJson('json/logo-migrations/basic/sinclair-basic/migrationToQBasic.json');

const processors = [
	genericProcessTo(migrationData),
	processRemoveInMigration,
	translateOperators
];

export function translateSinclairBasicToQBasic(code) {
	const scanTokens = scan(code);
	for (const processor of processors) {
		processor(scanTokens, migrationData);
	}
	const result = scanTokensToCode(scanTokens);
	return result;
};