import { fetchJson } from
'../../../../fetchJson.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { processRemoveInMigration } from
'../../helpers/processRemoveInMigration.js';
import { processSimpleLineCases } from
'./scantoken-processors/processSimpleLineCases.js';
import { processThenGoto } from
'../../helpers/processThenGoto.js';
import { removeCommasStartingParameterLists } from './scantoken-processors/removeCommasStartingParameterLists.js';
import { scan } from '../../qbasic/scanning/scan.js';
import { splitTokensEndingWithNumbers } from './scantoken-processors/splitTokensEndingWithNumbers.js';
const migrateToQBasicData = await fetchJson('json/logo-migrations/basic/commodore-basic/migrationToQBasic.json');

const commodoreTokenProcessors = [
	genericProcessTo(migrateToQBasicData),
	processRemoveInMigration,
	processSimpleLineCases,
	processThenGoto,
	removeCommasStartingParameterLists,
	splitTokensEndingWithNumbers
];

export function scanToQBasicTokens(code) {
	const scanTokens = scan(code);
	let continueLooping = true;
	while (continueLooping) {
		continueLooping = false;
		const oldScanTokensLength = scanTokens.length;
		for (const process of commodoreTokenProcessors) {
			process(scanTokens, migrateToQBasicData);
			if (scanTokens.length !== oldScanTokensLength) {
				continueLooping = true;
			}
		}
	}
	return scanTokens;
};