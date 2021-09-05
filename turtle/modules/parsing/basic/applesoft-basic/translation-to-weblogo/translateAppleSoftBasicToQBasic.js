import { fetchJson } from
'../../../../fetchJson.js';
import { processColorAssignments } from './scantoken-processors/processColorAssignments.js';
import { processHPlotToLine } from './scantoken-processors/processHPlotToLine.js';
import { processHPlotToPSET } from './scantoken-processors/processHPlotToPSET.js';
import { processRemoveInMigration } from '../../helpers/processRemoveInMigration.js';
import { sanitizeTrailingTokens } from './scantoken-processors/sanitizeTrailingTokens.js';
import { scan } from '../../qbasic/scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';
const migrationData = await fetchJson('json/logo-migrations/basic/applesoft-basic/migrationToQBASIC.json');

const applesoftTokenProcessors = [
	processColorAssignments,
	processHPlotToLine,
	processHPlotToPSET,
	sanitizeTrailingTokens
];

export function translateAppleSoftBasicToQBasic(code) {
	const scanTokens = scan(code);
	for (const process of applesoftTokenProcessors) {
		process(scanTokens);
	}
	processRemoveInMigration(scanTokens, migrationData);
	const result = scanTokensToCode(scanTokens);
	return result;
};