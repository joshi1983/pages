import { fetchJson } from
'../../../../fetchJson.js';
import { processColorAssignments } from './processColorAssignments.js';
import { processHPlotToLine } from './processHPlotToLine.js';
import { processHPlotToPSET } from './processHPlotToPSET.js';
import { processRemoveInMigration } from '../../helpers/processRemoveInMigration.js';
import { sanitizeTrailingTokens } from './sanitizeTrailingTokens.js';
import { scan as qbasicScan } from '../../qbasic/scanning/scan.js';

const migrationData = await fetchJson('json/logo-migrations/basic/applesoft-basic/migrationToQBASIC.json');

const applesoftTokenProcessors = [
	processColorAssignments,
	processHPlotToLine,
	processHPlotToPSET,
	sanitizeTrailingTokens
];

export function scan(code) {
	const scanTokens = qbasicScan(code);
	for (const processor of applesoftTokenProcessors) {
		processor(scanTokens);
	}
	processRemoveInMigration(scanTokens, migrationData);
	return scanTokens;
}