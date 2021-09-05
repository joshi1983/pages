import { fetchJson } from
'../../../../fetchJson.js';
import { genericInsertSpaces } from
'../../helpers/genericInsertSpaces.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { processSimpleLineCases } from
'./scantoken-processors/processSimpleLineCases.js';
import { removeCommasStartingParameterLists } from './scantoken-processors/removeCommasStartingParameterLists.js';
import { scan } from '../../qbasic/scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';
const migrateToQBasicData = await fetchJson('json/logo-migrations/basic/commodore-basic/migrationToQBasic.json');

const commodoreTokenProcessors = [
	genericProcessTo(migrateToQBasicData),
	processSimpleLineCases,
	removeCommasStartingParameterLists,
];

const insertSpaces = genericInsertSpaces([
	[/^\s*if\w/i, 1],
]);

export { insertSpaces };

export function translateCommodoreBasicToQBasic(code) {
	const scanTokens = scan(insertSpaces(code));
	let continueLooping = true;
	while (continueLooping) {
		continueLooping = false;
		const oldScanTokensLength = scanTokens.length;
		for (const process of commodoreTokenProcessors) {
			process(scanTokens);
			if (scanTokens.length !== oldScanTokensLength) {
				continueLooping = true;
			}
		}
	}
	const result = scanTokensToCode(scanTokens);
	return result;
};